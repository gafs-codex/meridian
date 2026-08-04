import products from "../data/products.json"
import { NavLink } from "react-router-dom"
import FeaturedCard from "../ui/FeaturedCard"
export default function OnSale() {
    const filteredSale = products.filter((product) => {
        return product.compareAt
    })
    return (
        <section className="sales">
            <div className="sale-header">
                <div>
                    <span className="eyebrow">Final markdowns</span>
                    <h2>On sale</h2>
                </div>
                <NavLink>
                    All sale items
                </NavLink>
            </div>

            <div className="sale-main">
                <div className="sale-cover">
                    {filteredSale.map((product) => {
                        return <FeaturedCard key={product.id} product={product} />
                    }).slice(0, 4)}
                </div>
            </div>
        </section>
    )
}