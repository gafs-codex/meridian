import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Checkout() {
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();

    const navigate = useNavigate();

    const shipping = subtotal > 150 ? 0 : 18;
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

    const [shippingMethod, setShippingMethod] = useState("Standard");

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
            setError("You must be signed in to place an order.");
            return;
        }


        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }


        try {
            setLoading(true);


            // ----------------------------------
            // 1. CREATE THE ORDER
            // ----------------------------------

            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user.id,

                    status: "processing",

                    shipping: shippingMethod,

                    total,

                    full_name: form.fullName,

                    email: form.email,

                    address: form.address,

                    city: form.city,

                    postal_code: form.postalCode,

                    country: form.country,

                    phone: form.phone || null,
                })
                .select()
                .single();


            if (orderError) {
                throw orderError;
            }


            // ----------------------------------
            // 2. CREATE ORDER ITEMS
            // ----------------------------------

            const orderItems = cartItems.map((item) => ({
                order_id: order.id,

                product_id: String(item.productId),

                product_name: item.name,

                product_image: item.image,

                price: item.price,

                quantity: item.quantity,

                color: item.color || null,

                size: item.size || null,
            }));


            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);


            if (itemsError) {
                throw itemsError;
            }


            // ----------------------------------
            // 3. CLEAR CART
            // ----------------------------------

            clearCart();


            // ----------------------------------
            // 4. SHOW SUCCESS
            // ----------------------------------

            setSuccess(
                `Order ${order.id} was placed successfully.`
            );


            // Send the user to their account after a short delay
            setTimeout(() => {
                navigate("/home/user");
            }, 1000);


        } catch (error) {

            console.error("Order creation error:", error);

            setError(
                error?.message ||
                "Something went wrong while placing your order."
            );

        } finally {
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

                    </div>


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
                            ? "Placing order..."
                            : `Pay $${total.toFixed(2)}`}
                    </button>

                </div>

            </div>
        </section>
    );
}