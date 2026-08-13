import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function User() {
    const [activeTab, setActiveTab] = useState("orders");

    const { favorites } = useFavorites();
    const { user, signOut } = useAuth();

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState("");


    useEffect(() => {
        async function fetchOrders() {
            if (!user) {
                setOrders([]);
                setLoadingOrders(false);
                return;
            }

            try {
                setLoadingOrders(true);
                setOrdersError("");

                const { data, error } = await supabase
                    .from("orders")
                    .select(`
                        id,
                        user_id,
                        status,
                        shipping,
                        total,
                        created_at,
                        full_name,
                        email,
                        address,
                        city,
                        postal_code,
                        country,
                        phone,
                        order_items (
                            id,
                            product_id,
                            product_name,
                            product_image,
                            price,
                            quantity,
                            color,
                            size
                        )
                    `)
                    .eq("user_id", user.id)
                    .order("created_at", {
                        ascending: false,
                    });


                if (error) {
                    throw error;
                }

                setOrders(data || []);

            } catch (error) {
                console.error("Failed to load orders:", error);

                setOrdersError(
                    error?.message ||
                    "Unable to load your orders."
                );

            } finally {
                setLoadingOrders(false);
            }
        }

        fetchOrders();

    }, [user]);


    async function handleSignOut() {
        try {
            await signOut();
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }


    return (
        <div className="user">

            <p className="user-label">
                My account
            </p>


            <h1 className="user-greeting">
                Hello, {user?.user_metadata?.username || user?.email}
            </h1>


            <div className="user-main">

                <nav className="user-nav">

                    <ul className="user-ul">

                        <li>
                            <button
                                className={
                                    activeTab === "orders"
                                        ? "user-nav-link active"
                                        : "user-nav-link"
                                }
                                onClick={() =>
                                    setActiveTab("orders")
                                }
                            >
                                Orders ({orders.length})
                            </button>
                        </li>


                        <li>
                            <button
                                className={
                                    activeTab === "profile"
                                        ? "user-nav-link active"
                                        : "user-nav-link"
                                }
                                onClick={() =>
                                    setActiveTab("profile")
                                }
                            >
                                Profile Details
                            </button>
                        </li>


                        <li>
                            <button
                                className="user-nav-link"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </li>

                    </ul>

                </nav>


                <div className="user-content">


                    {activeTab === "orders" && (

                        <div className="user-orders">

                            {loadingOrders ? (

                                <div className="user-empty">
                                    <p>
                                        Loading your orders...
                                    </p>
                                </div>

                            ) : ordersError ? (

                                <div className="user-empty">
                                    <p>
                                        {ordersError}
                                    </p>
                                </div>

                            ) : orders.length === 0 ? (

                                <div className="user-empty">
                                    <p>
                                        You have no orders yet.
                                    </p>

                                    <NavLink
                                        to="/home/shop"
                                        className="user-empty-link"
                                    >
                                        Start shopping
                                    </NavLink>
                                </div>

                            ) : (

                                orders.map((order) => (

                                    <div
                                        key={order.id}
                                        className="order-card"
                                    >

                                        <div className="order-card-header">

                                            <div>

                                                <p className="order-id">
                                                    {order.id}
                                                </p>

                                                <p className="order-meta">
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString()}

                                                    {" · "}

                                                    {order.status}

                                                    {" · "}

                                                    {order.shipping}
                                                </p>

                                            </div>


                                            <p className="order-total">
                                                $
                                                {Number(order.total).toFixed(2)}
                                            </p>

                                        </div>


                                        <div className="order-thumbs">

                                            {order.order_items?.map(
                                                (item) => (

                                                    <img
                                                        key={item.id}
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        className="order-thumb"
                                                    />

                                                )
                                            )}

                                        </div>


                                        <button
                                            className="view-order-btn"
                                            onClick={() =>
                                                navigate(`/home/orders/${order.id}`)
                                            }
                                        >
                                            View Order
                                        </button>

                                    </div>

                                ))

                            )}

                        </div>

                    )}

                    {activeTab === "profile" && (

                        <div className="user-profile">

                            <label>
                                <span>Name</span>

                                <input
                                    type="text"
                                    value={
                                        user?.user_metadata?.username || ""
                                    }
                                    readOnly
                                />
                            </label>


                            <label>
                                <span>Email</span>

                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                />
                            </label>


                            <label>
                                <span>Shipping address</span>

                                <input
                                    type="text"
                                    value=""
                                    readOnly
                                    placeholder="No saved address yet"
                                />
                            </label>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}