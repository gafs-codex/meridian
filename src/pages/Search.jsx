import { Search } from "lucide-react";
import { useSearchParams, NavLink } from "react-router-dom";
import FeaturedCard from "../ui/FeaturedCard";
import { useState, useEffect } from "react";
import { getProducts } from "../lib/products";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    const [input, setInput] = useState(query);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setInput(query);
    }, [query]);

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

    const searchResult = query
        ? products.filter((product) =>
            product.name
                .toLowerCase()
                .includes(query.toLowerCase())
        )
        : [];

    function handleSubmit(e) {
        e.preventDefault();

        const trim = input.trim();

        if (!trim) return;

        setSearchParams({ q: trim });
    }

    if (loading) {
        return (
            <main className="search-results-page">
                <p>Loading products...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="search-results-page">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="search-results-page">
            <div className="search-results-header">
                <h1>
                    Search
                </h1>

                <form
                    className="search-form"
                    onSubmit={handleSubmit}
                >
                    <Search size={20} color="#746c63" />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button type="submit">
                        GO
                    </button>
                </form>

                <p>
                    {searchResult.length} product
                    {searchResult.length !== 1 ? "s" : ""} found
                </p>
            </div>

            {searchResult.length === 0 ? (
                <div className="search-empty">
                    <p>
                        No pieces matched that search
                    </p>

                    <NavLink
                        to="/home/shop"
                        className="link"
                    >
                        Browse all products
                    </NavLink>
                </div>
            ) : (
                <div className="search-results-grid">
                    {searchResult.map((product) => (
                        <FeaturedCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}