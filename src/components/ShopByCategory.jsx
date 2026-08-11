import categories from "../data/categories.json"
import { NavLink, Link } from "react-router-dom"
export default function ShopByCategory() {
    return (
        <section className="shop-categ">
            <div className="categ-header">
                <h2>Shop by category</h2>

                <NavLink className="link">
                    View all
                </NavLink>
            </div>


            <div className="categ-main">
                <div className="categ-cover">
                    {categories.map((cat) => {
                        return (
                            <Link to={`/home/shop/${cat.name.toLowerCase()}`}>
                                <div className="categ-card" key={cat.slug}>
                                    <img src={cat.image} alt={cat.name} className="categ-img" />
                                    <div className="categ-text">
                                        <h3>{cat.name}</h3>
                                        <p>{cat.blurb}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}