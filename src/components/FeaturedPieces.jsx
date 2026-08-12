import { getProducts } from "../lib/products";
import { NavLink } from "react-router-dom";
import FeaturedCard from "../ui/FeaturedCard";
import { useState, useEffect } from "react";

export default function FeaturedPieces() {
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
                console.error("Failed to load products:", error);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        return product.rating >= 4.6;
    });

    if (loading) {
        return (
            <main className="shop-loading">
                <p>Loading products...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="shop-loading">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <section className="featured">
            <div className="featured-header">
                <div className="featured-start">
                    <span className="eyebrow">Most loved</span>
                    <h2>Featured Pieces</h2>
                </div>

                <NavLink to="/home/shop" className="link">
                    All products
                </NavLink>
            </div>

            <div className="featured-main">
                <div className="featured-cover">
                    {filteredProducts.slice(0, 8).map((product) => (
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