import products from "../data/products.json"
import { NavLink } from "react-router-dom"
import FeaturedCard from "../ui/FeaturedCard"
export default function FeaturedPieces() {
    const filteredProducts = products.filter((product) => {
        return product.rating >= 4.6
    })
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