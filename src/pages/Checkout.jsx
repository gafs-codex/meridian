import { useCart } from "../context/CartContext"

export default function Checkout() {
    const { cartItems, subtotal } = useCart();
    const shipping = subtotal > 150 ? 0 : 18;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <section className="checkout">
            <h1>Checkout</h1>

            <div className="checkout-main">
                <form className="form">
                    <h2>Contact & delivery</h2>

                    <div className="form-main">
                        <label htmlFor="">
                            <span>Full name</span>
                            <input type="text" required />
                        </label>

                        <label htmlFor="">
                            <span>Email</span>
                            <input type="text" required />
                        </label>

                        <label htmlFor="">
                            <span>Address</span>
                            <input type="text" required />
                        </label>

                        <div className="form-row">
                            <label>
                                <span>City</span>
                                <input type="text" required />
                            </label>
                            <label>
                                <span>Postal code</span>
                                <input type="text" required />
                            </label>
                        </div>

                        <div className="form-row">
                            <label>
                                <span>Country</span>
                                <input type="text" required />
                            </label>
                            <label>
                                <span>Phone (optional)</span>
                                <input type="text" required />
                            </label>
                        </div>
                    </div>

                    <div className="shipping-method">
                        <h2>Shipping method</h2>

                        <div>
                            <label htmlFor="shipped">
                                <span>
                                    <input type="radio" name="ship" id="shipped" />
                                    Standard — 3–5 business days
                                </span>

                                <span>Free</span>
                            </label>

                            <label htmlFor="shipp">
                                <span>
                                    <input type="radio" name="ship" id="shipp" />
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
                                <input type="text" placeholder="4242 4242 4242 4242" required />
                            </label>
                            <div className="form-row">
                                <label>
                                    <span>Expiry</span>
                                    <input type="text" placeholder="12 / 29" required />
                                </label>
                                <label>
                                    <span>CVC</span>
                                    <input type="text" maxLength={3} placeholder="123" required />
                                </label>
                            </div>
                        </div>
                    </div>
                </form>



                <div className="full-order-summary">
                    <h3>Order summary</h3>

                    {cartItems.map((item) => (
                        <div key={item.cartItemId} className="summary-item">
                            <img src={item.image} alt={item.name} />
                            <div className="summary-item-info">
                                <div className="summary-item-details">
                                    <h4>{item.name}</h4>
                                    <p>{item.color} · {item.size} · Qty {item.quantity}</p>
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

                    <button className="pay-btn">Pay ${total.toFixed(2)}</button>
                </div>
            </div>
        </section>
    )
}