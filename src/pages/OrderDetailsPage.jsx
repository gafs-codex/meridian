import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchOrder() {
            if (!user || !orderId) { setLoading(false); return; }
            try {
                setLoading(true);
                setError("");
                const { data, error } = await supabase
                    .from("orders")
                    .select(`
                        id, user_id, status, shipping, total, created_at,
                        full_name, email, address, city, postal_code, country, phone,
                        order_items (
                            id, product_id, product_name, product_image,
                            price, quantity, color, size
                        )
                    `)
                    .eq("id", orderId)
                    .eq("user_id", user.id)
                    .single();
                if (error) throw error;
                setOrder(data);
            } catch (error) {
                console.error("Failed to load order:", error);
                setError("We couldn't find that order.");
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId, user]);

    if (loading) {
        return (
            <main className="order-details-page">
                <p className="order-details-loading">Loading order...</p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="order-details-page">
                <p className="order-details-error">{error || "Order not found."}</p>
                <Link to="/home/user" className="order-back-link">Back to My Account</Link>
            </main>
        );
    }

    const username = user?.user_metadata?.username || "there";
    return (
        <main className="order-details-page">
            <div className="order-details-inner">


                <div className="order-confirm-top">
                    <div className="order-check-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b6502b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h1 className="order-thank-you">Thank you, {username}</h1>

                    <p className="order-confirm-text">
                        Order <span className="order-confirm-id">{order.id}</span> is confirmed.
                        A receipt is on its way to {order.email}.
                    </p>
                </div>

                <div className="order-items-list">
                    {order.order_items?.map((item) => (
                        <div key={item.id} className="order-detail-item">
                            <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="order-detail-img"
                            />
                            <div className="order-detail-info">
                                <h3 className="order-detail-name">{item.product_name}</h3>
                                <p className="order-detail-meta">
                                    {item.color} · {item.size} · Qty {item.quantity}
                                </p>
                            </div>
                            <p className="order-detail-price">
                                ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="order-details-footer">
                    <div className="order-summary-block">
                        <h2 className="order-block-title">Order summary</h2>
                        <div className="order-summary-rows">
                            <div className="order-summary-row">
                                <span>Status</span>
                                <span>{order.status}</span>
                            </div>
                            <div className="order-summary-row">
                                <span>Shipping</span>
                                <span>{order.shipping}</span>
                            </div>
                            <div className="order-summary-row order-summary-total">
                                <span>Total</span>
                                <span>${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-delivery-block">
                        <h2 className="order-block-title">Delivery</h2>
                        <p>{order.full_name}</p>
                        <p>{order.email}</p>
                        {order.phone && <p>{order.phone}</p>}
                        <p>{order.address}</p>
                        <p>{order.city}, {order.postal_code}</p>
                        <p>{order.country}</p>
                    </div>
                </div>

                <Link to="/home/user" className="order-back-link">
                    ← Back to My Account
                </Link>

            </div>
        </main>
    );
}