import { useState } from "react";
import FeaturedCard from "../ui/FeaturedCard"
import products from '../data/products.json'
import { NavLink, useParams } from "react-router-dom"
import { Check } from "lucide-react";
export default function Shop() {
    const [visibleCount, setVisibleCount] = useState(8);
    const [check, setCheck] = useState(false)
    const [checkedCollections, setCheckedCollections] = useState([])
    const hasMore = visibleCount < products.length;
    const { category } = useParams()

    const filteredProduct = category ? products.filter(product => product.category === category) : products

    const collections = ["Atelier", "Everyday", "Archive", "Travel"]


    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    function handleChecked(collection) {
        setCheckedCollections(prev => prev.includes(collection) ? prev.filter(coll => coll !== collection) : [...prev, collection])
    }
    return (
        <main>
            <div className="shop-header">
                <nav className="slug-link">
                    <NavLink className="link" to="/">
                        Home
                    </NavLink>
                    <span>/</span>

                    <NavLink className="link" to="/shop">
                        Shop
                    </NavLink>
                    {category && (
                        <>
                            <span>/</span>
                            <span className="link current">{category}</span>
                        </>
                    )}
                </nav>

                <div className="title-header">
                    <h1>All Products</h1>
                    <p>Small-run pieces, restocked rarely.</p>
                </div>
            </div>


            <div className="shop-main">
                <aside>
                    <div>
                        <div className="aside-categ">
                            <h3>Category</h3>

                            <ul>
                                <li><NavLink end className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/shop">All products</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/shop/women">Women</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/shop/men">Men</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/shop/footwear">Footwear</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/shop/accessories">Accessories</NavLink></li>
                            </ul>
                        </div>

                        <div className="aside-price">
                            <h3>Price</h3>
                            <span></span>
                            <p>$0.00 -  $640.00</p>
                        </div>

                        <div className="aside-collection">
                            <h3>Collection</h3>

                            <ul>
                                {collections.map((collection) => {
                                    const isChecked = checkedCollections.includes(collection)
                                    return <li key={collection}>
                                        <button onClick={() => handleChecked(collection)} id={`${collection}`} type="button" role="checkbox" className={isChecked ? "checked" : ""}>
                                            {isChecked && <Check color="white" />}
                                        </button>
                                        <label htmlFor={`${collection}`}>{collection}</label>
                                    </li>
                                })}
                            </ul>
                        </div>

                        <div className="aside-other">
                            <button></button>
                            <label htmlFor="">In stock</label>
                        </div>

                        <div className="aside-other">
                            <button></button>
                            <label htmlFor="">On sale</label>
                        </div>
                    </div>
                </aside>



                <div>
                    <div className="display-header">
                        <p>{filteredProduct.length} products</p>
                    </div>

                    <div className="display-main">
                        {filteredProduct.slice(0, visibleCount).map((product) => {
                            return <FeaturedCard key={product.id} product={product} />
                        })}
                    </div>

                    {hasMore &&
                        (<div className="loadmore">
                            <button onClick={handleLoadMore}>
                                Load More
                            </button>
                        </div>)
                    }
                </div>
            </div>
        </main>
    )
}