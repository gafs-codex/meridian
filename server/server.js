import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: ".env.local" });

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());



app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Stripe server is running",
    });
});



app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const {
            cartItems,
            shipping,
            tax,
            total,
        } = req.body;


        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                error: "Cart is empty.",
            });
        }


        // Convert your cart items into Stripe line items
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: "usd",

                product_data: {
                    name: item.name,

                    metadata: {
                        product_id: String(item.productId),
                        color: item.color || "",
                        size: item.size || "",
                    },
                },

                unit_amount: Math.round(Number(item.price) * 100),
            },

            quantity: item.quantity,
        }));

        if (shipping > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",

                    product_data: {
                        name: "Shipping",
                    },

                    unit_amount: Math.round(
                        Number(shipping) * 100
                    ),
                },

                quantity: 1,
            });
        }


        if (tax > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",

                    product_data: {
                        name: "Tax",
                    },

                    unit_amount: Math.round(
                        Number(tax) * 100
                    ),
                },

                quantity: 1,
            });
        }


        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: lineItems,

            success_url:
                "http://localhost:5173/home/checkout/success?session_id={CHECKOUT_SESSION_ID}",

            cancel_url:
                "http://localhost:5173/home/checkout",

            billing_address_collection: "required",

            metadata: {
                cart_total: String(total),
            },
        });


        res.json({
            url: session.url,
        });

    } catch (error) {

        console.error(
            "Stripe Checkout Session error:",
            error
        );

        res.status(500).json({
            error:
                error?.message ||
                "Unable to create Stripe Checkout Session.",
        });
    }
});

// -------------------------------------
// Verify Stripe Checkout Session
// -------------------------------------

app.get("/api/checkout-session/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                error: "Missing Checkout Session ID.",
            });
        }

        const session = await stripe.checkout.sessions.retrieve(
            sessionId
        );

        res.json({
            id: session.id,
            payment_status: session.payment_status,
            status: session.status,
            customer_email:
                session.customer_details?.email || null,
            amount_total: session.amount_total,
            currency: session.currency,
        });

    } catch (error) {
        console.error(
            "Stripe session verification error:",
            error
        );

        res.status(500).json({
            error:
                error?.message ||
                "Unable to verify Stripe session.",
        });
    }
});

const PORT = 4242;

app.listen(PORT, () => {
    console.log(
        `Stripe server running on http://localhost:${PORT}`
    );
});