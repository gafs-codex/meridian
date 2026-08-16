import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({
            error: "Missing Checkout Session ID.",
        });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.status(200).json({
            id: session.id,
            payment_status: session.payment_status,
            status: session.status,
            customer_email: session.customer_details?.email || null,
            amount_total: session.amount_total,
            currency: session.currency,
        });

    } catch (error) {
        console.error("Stripe session verification error:", error);
        res.status(500).json({
            error: error?.message || "Unable to verify Stripe session.",
        });
    }
}