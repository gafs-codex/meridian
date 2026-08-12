import { useFavorites } from "../context/FavoritesContext";
import { getProducts } from "../lib/products";
import FeaturedCard from "../ui/FeaturedCard";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Favorites() {
    const { favorites } = useFavorites();

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
                console.error("Failed to load favorite products:", error);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const favoriteProduct = favorites
        .map((favorite) => {
            return products.find(
                (product) => product.id === favorite
            );
        })
        .filter(Boolean);

    if (loading) {
        return (
            <section className="favorites">
                <p>Loading favorites...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="favorites">
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="favorites">
            <div className="favorites-header">
                <h1>Favorites</h1>

                <p>
                    {favoriteProduct.length} saved piece
                    {favoriteProduct.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="favorites-main">
                {favoriteProduct.length === 0 ? (
                    <div className="favorites-empty">
                        <p>
                            Nothing saved yet — tap the heart
                            on any piece to keep it here.
                        </p>

                        <NavLink to="/home/shop">
                            <button className="favorites-link">
                                Browse the collection
                            </button>
                        </NavLink>
                    </div>
                ) : (
                    <div className="show-favorites">
                        {favoriteProduct.map((product) => (
                            <FeaturedCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}