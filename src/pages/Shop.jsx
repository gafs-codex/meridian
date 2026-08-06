import categories from '../data/categories.json'
import { useState } from "react";
import FeaturedCard from "../ui/FeaturedCard"
import products from '../data/products.json'
import { NavLink, useParams } from "react-router-dom"
import { Check } from "lucide-react";
export default function Shop() {
    const [visibleCount, setVisibleCount] = useState(8);
    // const [check, setCheck] = useState(false)
    const [checkedCollections, setCheckedCollections] = useState([])
    const [inStockOnly, setInStockOnly] = useState(false)
    const [onSale, setOnSale] = useState(false)
    const hasMore = visibleCount < products.length;
    const { category } = useParams()

    const filteredProduct = products.filter((product) => {
        const matchesCategory = category ? product.category === category : true;
        const matchesCollection = checkedCollections.length === 0 || checkedCollections.includes(product.collection);
        const matchesStock = !inStockOnly || product.stock > 0;
        const matchesSale = !onSale || Boolean(product.compareAt);

        return matchesCategory && matchesCollection && matchesStock && matchesSale;
    })
    const collections = ["Atelier", "Everyday", "Archive", "Travel"]
    const currentCategory = categories.find(categ => categ.slug === category)

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8)
    };

    function handleChecked(collection) {
        setCheckedCollections(prev => prev.includes(collection) ? prev.filter(coll => coll !== collection) : [...prev, collection])
    }

    function handleStock() {
        setInStockOnly(prev => !prev)
    }
    function handleSale() {
        setOnSale(prev => !prev)
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
                    <h1>{currentCategory ? currentCategory.name : "All products"}</h1>
                    <p>{currentCategory ? currentCategory.blurb : "Small-run pieces, restocked rarely."}</p>
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
                            <button onClick={handleStock} id='stock' type="button" role="checkbox" className={inStockOnly ? "checked" : ""}>
                                {inStockOnly && <Check color='white' />}
                            </button>
                            <label htmlFor="stock">In stock</label>
                        </div>

                        <div className="aside-other">
                            <button onClick={handleSale} id='sale' type="button" role="checkbox" className={onSale ? "checked" : ""}>
                                {onSale && <Check color='white' />}
                            </button>
                            <label htmlFor="sale">On sale</label>
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