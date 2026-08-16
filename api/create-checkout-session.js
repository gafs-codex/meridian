import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { cartItems, shipping, tax, total } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                error: "Cart is empty.",
            });
        }

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
                    product_data: { name: "Shipping" },
                    unit_amount: Math.round(Number(shipping) * 100),
                },
                quantity: 1,
            });
        }

        if (tax > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Tax" },
                    unit_amount: Math.round(Number(tax) * 100),
                },
                quantity: 1,
            });
        }

        const origin = req.headers.origin || `https://${req.headers.host}`;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: `${origin}/home/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/home/checkout`,
            billing_address_collection: "required",
            metadata: {
                cart_total: String(total),
            },
        });

        res.status(200).json({ url: session.url });

    } catch (error) {
        console.error("Stripe Checkout Session error:", error);
        res.status(500).json({
            error: error?.message || "Unable to create Stripe Checkout Session.",
        });
    }
}