import { getProducts } from "../lib/products";
import { NavLink } from "react-router-dom"
import FeaturedCard from "../ui/FeaturedCard"
export default function FeaturedPieces() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredProducts = products.filter((product) => {
        return product.rating >= 4.6
    })

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
                    {filteredProducts.map((product) => {
                        return <FeaturedCard key={product.id} product={product} />
                    }).slice(0, 8)}
                </div>
            </div>
        </section>
    )
}