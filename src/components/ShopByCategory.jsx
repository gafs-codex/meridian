import categories from "../data/categories.json"
import { NavLink } from "react-router-dom"
export default function ShopByCategory() {
    return (
        <section className="shop-categ">
            <div className="categ-header">
                <h2>Shop by category</h2>

                <NavLink>
                    View All
                </NavLink>
            </div>


            <div className="categ-main">
                <div className="categ-cover">
                    {categories.map((cat) => {
                        return (
                            <div className="categ-card" key={cat.slug}>
                                <img src={cat.image} alt={cat.name} className="categ-img" />
                                <div className="categ-text">
                                    <h3>{cat.name}</h3>
                                    <p>{cat.blurb}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}