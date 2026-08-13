import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { clearCart } = useCart();
    const { user } = useAuth();

    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        async function completeOrder() {
            if (!sessionId) {
                setError("Missing Stripe Checkout Session.");
                setLoading(false);
                return;
            }

            if (!user) {
                setError("You must be signed in to complete this order.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // -----------------------------------------
                // 1. VERIFY PAYMENT WITH OUR SERVER
                // -----------------------------------------

                const response = await fetch(
                    `http://localhost:4242/api/checkout-session/${sessionId}`
                );

                const stripeData = await response.json();

                if (!response.ok) {
                    throw new Error(
                        stripeData.error ||
                        "Unable to verify payment."
                    );
                }

                console.log(
                    "Verified Stripe session:",
                    stripeData
                );

                if (stripeData.payment_status !== "paid") {
                    throw new Error(
                        "Payment has not been completed."
                    );
                }

                setPaid(true);


                // -----------------------------------------
                // 2. CHECK WHETHER THIS ORDER ALREADY EXISTS
                // -----------------------------------------

                const { data: existingOrder, error: existingError } =
                    await supabase
                        .from("orders")
                        .select("id")
                        .eq("stripe_session_id", sessionId)
                        .maybeSingle();

                if (existingError) {
                    throw existingError;
                }

                if (existingOrder) {
                    setOrderId(existingOrder.id);
                    setLoading(false);
                    return;
                }


                // -----------------------------------------
                // 3. GET CHECKOUT DATA
                // -----------------------------------------

                const storedCheckout =
                    sessionStorage.getItem(
                        "pending_checkout"
                    );

                if (!storedCheckout) {
                    throw new Error(
                        "Checkout information could not be found."
                    );
                }

                const checkout =
                    JSON.parse(storedCheckout);


                // Make sure the stored checkout belongs
                // to the currently authenticated user.
                if (checkout.userId !== user.id) {
                    throw new Error(
                        "This checkout does not belong to the current user."
                    );
                }


                // -----------------------------------------
                // 4. CREATE ORDER
                // -----------------------------------------

                const { data: order, error: orderError } =
                    await supabase
                        .from("orders")
                        .insert({
                            user_id: user.id,
                            status: "processing",
                            shipping: checkout.shippingMethod,
                            total: checkout.total,
                            stripe_session_id: sessionId,

                            full_name:
                                checkout.form.fullName,

                            email:
                                checkout.form.email,

                            address:
                                checkout.form.address,

                            city:
                                checkout.form.city,

                            postal_code:
                                checkout.form.postalCode,

                            country:
                                checkout.form.country,

                            phone:
                                checkout.form.phone || null,
                        })
                        .select()
                        .single();

                if (orderError) {
                    throw orderError;
                }


                // -----------------------------------------
                // 5. CREATE ORDER ITEMS
                // -----------------------------------------

                const orderItems =
                    checkout.cartItems.map((item) => ({
                        order_id: order.id,

                        product_id:
                            String(item.productId),

                        product_name:
                            item.name,

                        product_image:
                            item.image,

                        price:
                            item.price,

                        quantity:
                            item.quantity,

                        color:
                            item.color || null,

                        size:
                            item.size || null,
                    }));


                const { error: itemsError } =
                    await supabase
                        .from("order_items")
                        .insert(orderItems);

                if (itemsError) {
                    throw itemsError;
                }


                // -----------------------------------------
                // 6. CLEAR PENDING CHECKOUT
                // -----------------------------------------

                sessionStorage.removeItem(
                    "pending_checkout"
                );


                // -----------------------------------------
                // 7. CLEAR CART
                // -----------------------------------------

                clearCart();


                // -----------------------------------------
                // 8. SAVE ORDER ID
                // -----------------------------------------

                setOrderId(order.id);

            } catch (error) {
                console.error(
                    "Order completion error:",
                    error
                );

                setError(
                    error?.message ||
                    "Payment succeeded, but we couldn't create your order."
                );
            } finally {
                setLoading(false);
            }
        }

        completeOrder();
    }, [sessionId, user, clearCart]);


    if (loading) {
        return (
            <main className="checkout-success">
                <div className="checkout-success-inner">
                    <p className="eyebrow">
                        Payment
                    </p>

                    <h1>
                        Confirming your order...
                    </h1>

                    <p>
                        Your payment has been verified.
                        We're saving your order now.
                    </p>
                </div>
            </main>
        );
    }


    if (error) {
        return (
            <main className="checkout-success">
                <div className="checkout-success-inner">

                    <div className="checkout-success-icon">
                        !
                    </div>

                    <p className="eyebrow">
                        Something went wrong
                    </p>

                    <h1>
                        We couldn't complete your order
                    </h1>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="checkout-success-link"
                        onClick={() =>
                            navigate("/home/user")
                        }
                    >
                        Go to My Account
                    </button>

                </div>
            </main>
        );
    }


    if (paid && orderId) {
        return (
            <main className="checkout-success">
                <div className="checkout-success-inner">

                    <div
                        className="checkout-success-icon"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    <p className="eyebrow">
                        Payment successful
                    </p>

                    <h1>
                        Thank you for your order
                    </h1>

                    <p>
                        Your payment was successfully
                        verified and your order has been
                        created.
                    </p>

                    <button
                        type="button"
                        className="checkout-success-link"
                        onClick={() =>
                            navigate(
                                `/home/orders/${orderId}`
                            )
                        }
                    >
                        View order
                    </button>

                </div>
            </main>
        );
    }


    return null;
}