import { useCart } from "../context/CartContext"
import { NavLink, useNavigate } from "react-router-dom"
import { Minus, Plus, X } from 'lucide-react'

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
    const navigate = useNavigate()

    const shipping = subtotal > 150 ? 0 : 12
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax


    return (
        <section className="cart">
            <h1>Your bag</h1>

            {cartItems.length === 0 ? (
                <div className="empty-bag">
                    <p>Your bag is currently empty.</p>

                    <NavLink to="/shop">
                        <button>
                            Continue shopping
                        </button>
                    </NavLink>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            return <div key={item.cartItemId} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-info">
                                    <div className="cart-item-header">
                                        <h3>{item.name}</h3>
                                        <button onClick={() => removeFromCart(item.cartItemId)}>
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <p className="cart-item-variant">{item.color} · Size {item.size}</p>

                                    <div className="cart-item-footer">
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="cart-item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="order-summary">
                        <h2>Order summary</h2>
                        <div className="promo-row">
                            <input type="text" placeholder="Promo code" />
                            <button>Apply</button>
                        </div>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Estimated tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => navigate("/home/checkout")}>
                            Checkout
                        </button>
                        <NavLink to="/home/shop" className="continue-link">Continue shopping</NavLink>
                    </div>
                </div>
            )}
        </section>
    )
}