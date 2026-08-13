import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
// import { supabase } from "../lib/supabase";

export default function Checkout() {
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [shippingMethod, setShippingMethod] = useState("Standard");

    const navigate = useNavigate();
    const standardShipping = subtotal > 150 ? 0 : 12;
    const expressShipping = 18;

    const shipping =
        shippingMethod === "Express"
            ? expressShipping
            : standardShipping;

    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const [form, setForm] = useState({
        fullName: "",
        email: user?.email || "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handlePlaceOrder(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!user) {
            setError("You must be signed in to continue.");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        try {
            setLoading(true);

            /*
             * Save everything we need after Stripe redirects
             * the user back to Meridian.
             */
            const pendingCheckout = {
                userId: user.id,
                form,
                shippingMethod,
                shipping,
                tax,
                total,
                cartItems,
            };

            sessionStorage.setItem(
                "pending_checkout",
                JSON.stringify(pendingCheckout)
            );

            const response = await fetch(
                "http://localhost:4242/api/create-checkout-session",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cartItems,
                        shipping,
                        tax,
                        total,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to start payment."
                );
            }

            if (!data.url) {
                throw new Error(
                    "Stripe did not return a checkout URL."
                );
            }

            window.location.href = data.url;

        } catch (error) {
            console.error("Stripe checkout error:", error);

            sessionStorage.removeItem("pending_checkout");

            setError(
                error?.message ||
                "Unable to start payment."
            );

            setLoading(false);
        }
    }


    return (
        <section className="checkout">
            <h1>Checkout</h1>

            <div className="checkout-main">

                <form
                    className="form"
                    onSubmit={handlePlaceOrder}
                >
                    <h2>Contact & delivery</h2>

                    <div className="form-main">

                        <label>
                            <span>Full name</span>

                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </label>


                        <label>
                            <span>Email</span>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </label>


                        <label>
                            <span>Address</span>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />
                        </label>


                        <div className="form-row">

                            <label>
                                <span>City</span>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                />
                            </label>


                            <label>
                                <span>Postal code</span>

                                <input
                                    type="text"
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                        </div>


                        <div className="form-row">

                            <label>
                                <span>Country</span>

                                <input
                                    type="text"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    required
                                />
                            </label>


                            <label>
                                <span>Phone (optional)</span>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </label>

                        </div>

                    </div>


                    <div className="shipping-method">

                        <h2>Shipping method</h2>

                        <div>

                            <label htmlFor="shipped">

                                <span>
                                    <input
                                        type="radio"
                                        name="ship"
                                        id="shipped"
                                        value="Standard"
                                        checked={
                                            shippingMethod === "Standard"
                                        }
                                        onChange={(e) =>
                                            setShippingMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    Standard — 3–5 business days
                                </span>

                                <span>Free</span>

                            </label>


                            <label htmlFor="shipp">

                                <span>
                                    <input
                                        type="radio"
                                        name="ship"
                                        id="shipp"
                                        value="Express"
                                        checked={
                                            shippingMethod === "Express"
                                        }
                                        onChange={(e) =>
                                            setShippingMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    Express — 1–2 business days
                                </span>

                                <span>$18.00</span>

                            </label>

                        </div>

                    </div>

{/* 
                    <div className="payment">

                        <h2>Payment</h2>

                        <div>

                            <label>
                                <span>Card number</span>

                                <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    required
                                />
                            </label>


                            <div className="form-row">

                                <label>
                                    <span>Expiry</span>

                                    <input
                                        type="text"
                                        placeholder="12 / 29"
                                        required
                                    />
                                </label>


                                <label>
                                    <span>CVC</span>

                                    <input
                                        type="text"
                                        maxLength={3}
                                        placeholder="123"
                                        required
                                    />
                                </label>

                            </div>

                        </div>

                    </div> */}


                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}


                    {success && (
                        <p className="auth-success">
                            {success}
                        </p>
                    )}

                </form>


                <div className="full-order-summary">

                    <h3>Order summary</h3>


                    {cartItems.map((item) => (
                        <div
                            key={item.cartItemId}
                            className="summary-item"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="summary-item-info">

                                <div className="summary-item-details">

                                    <h4>{item.name}</h4>

                                    <p>
                                        {item.color} · {item.size} · Qty {item.quantity}
                                    </p>

                                </div>

                                <span className="summary-item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>

                            </div>
                        </div>
                    ))}


                    <div className="summary-divider" />


                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>


                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                    </div>


                    <div className="summary-row">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>


                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>


                    <button
                        className="pay-btn"
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            document
                                .querySelector(".checkout .form")
                                ?.requestSubmit();
                        }}
                    >
                        {loading
                            ? "Opening payment..."
                            : `Pay $${total.toFixed(2)}`}
                    </button>

                </div>

            </div>
        </section>
    );
}