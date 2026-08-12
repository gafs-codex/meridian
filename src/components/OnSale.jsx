import { useEffect, useState } from "react";
import { getProducts } from "../lib/products";
import { NavLink } from "react-router-dom";
import FeaturedCard from "../ui/FeaturedCard";

export default function OnSale() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);

                const data = await getProducts();

                setProducts(data);
            } catch (error) {
                console.error("Failed to load sale products:", error);
                setError("Unable to load sale products.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredSale = products.filter((product) => {
        return Boolean(product.compareAt);
    });

    if (loading) {
        return (
            <section className="sales">
                <p>Loading sale products...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sales">
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="sales">
            <div className="sale-header">
                <div>
                    <span className="eyebrow">Final markdowns</span>
                    <h2>On sale</h2>
                </div>

                <NavLink
                    to="/home/shop?sale=true"
                    className="link"
                >
                    All sale items
                </NavLink>
            </div>

            <div className="sale-main">
                <div className="sale-cover">
                    {filteredSale.slice(0, 4).map((product) => (
                        <FeaturedCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}