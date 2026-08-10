import categories from '../data/categories.json'
import { useState, useEffect } from "react";
import FeaturedCard from "../ui/FeaturedCard"
import SortDropdown from '../ui/SortDropdown';
import products from '../data/products.json'
import { NavLink, useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Check, SlidersHorizontal, X } from "lucide-react";
export default function Shop() {
    const [searchParams] = useSearchParams();
    const [visibleCount, setVisibleCount] = useState(8);
    const [checkedCollections, setCheckedCollections] = useState([])
    const [inStockOnly, setInStockOnly] = useState(false)
    const [onSale, setOnSale] = useState(searchParams.get("sale") === "true");
    const [sortBy, setSortBy] = useState("featured");
    const [maxPrice, setMaxPrice] = useState(640);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { category } = useParams();
    const minPrice = 0;
    const absoluteMax = 640;

    const validCategories = ["women", "men", "footwear", "accessories"];
    const navigate = useNavigate();

    useEffect(() => {
        if (category && !validCategories.includes(category)) {
            navigate("/404", { replace: true });
        }
    }, [category]);

    useEffect(() => {
        const saleParam = searchParams.get("sale");
        if (saleParam === "true") {
            setOnSale(true);
        }
    }, [searchParams]);

    const filteredProduct = products.filter((product) => {
        const matchesCategory = category ? product.category === category : true;
        const matchesCollection = checkedCollections.length === 0 || checkedCollections.includes(product.collection);
        const matchesStock = !inStockOnly || product.stock > 0;
        const matchesSale = !onSale || Boolean(product.compareAt);
        const matchesPrice = product.price <= maxPrice;

        return matchesCategory && matchesCollection && matchesStock && matchesSale && matchesPrice;
    })

    const sortedProducts = [...filteredProduct].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "rating":
                return b.rating - a.rating;
            case "newest":
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            default:
                return 0;
        }
    })
    const collections = ["Atelier", "Everyday", "Archive", "Travel"]
    const currentCategory = categories.find(categ => categ.slug === category)
    const hasMore = visibleCount < sortedProducts.length;

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
                    <NavLink className="link" to="/home">
                        Home
                    </NavLink>
                    <span>/</span>

                    <NavLink className="link" to="/home/shop">
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

                <div className="mobile-filter-bar">
                    <button className="filters-trigger" onClick={() => setFiltersOpen(true)}>
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                    <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                </div>

                <aside className={filtersOpen ? "aside-open" : ""}>
                    <div>
                        <div className="aside-heading">
                            <h2>Filters</h2>
                            <button className="close-filters" onClick={() => setFiltersOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="aside-categ">
                            <h3>Category</h3>

                            <ul>
                                <li><NavLink end className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/home/shop">All products</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/home/shop/women">Women</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/home/shop/men">Men</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/home/shop/footwear">Footwear</NavLink></li>
                                <li><NavLink className={({ isActive }) => isActive ? "link li-links active" : "link li-links"} to="/home/shop/accessories">Accessories</NavLink></li>
                            </ul>
                        </div>

                        <div className="aside-price">
                            <h3>Price</h3>
                            <input
                                type="range"
                                min={minPrice}
                                max={absoluteMax}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="price-slider"
                            />
                            <p>${minPrice.toFixed(2)} — ${maxPrice.toFixed(2)}</p>
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

                        <button className="clear-filters" onClick={() => {
                            setCheckedCollections([]);
                            setInStockOnly(false);
                            setOnSale(false);
                            setMaxPrice(absoluteMax);
                        }}>
                            Clear all filters
                        </button>


                        <button className="show-results-btn" onClick={() => setFiltersOpen(false)}>
                            Show {sortedProducts.length} Results
                        </button>
                    </div>
                </aside>



                <div>
                    <div className="display-header">
                        <p>{sortedProducts.length} products</p>

                        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                    </div>

                    <div className="display-main">
                        {sortedProducts.slice(0, visibleCount).map((product) => {
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