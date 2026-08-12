import { Heart, Minus, Plus, Star, Dot } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useParams, NavLink, useNavigate } from "react-router-dom"
import products from '../data/products/products.json'
import reviews from '../data/reviews.json'
import FeaturedCard from "../ui/FeaturedCard"
import { addRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed"
import { useFavorites } from "../context/FavoritesContext"
import { useCart } from "../context/CartContext"

export default function ProductDetailsPage() {
    const { isFavorites, toggleFavorites } = useFavorites();
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const { id } = useParams()


    const product = products.find(product => String(product.id) === id)
    const productReviewData = reviews.find(review => review.productId === id)
    const productReviews = productReviewData ? productReviewData.reviews : []
    const favorited = product ? isFavorites(product.id) : false;

    const [amount, setAmount] = useState(1)
    const [selectedColor, setSelectedColor] = useState(product?.colors[0])
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

    const relatedProducts = useMemo(
        () => products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
        [product]
    )

    useEffect(() => {
        if (!product) return;

        addRecentlyViewed(product.id);
        setRecentlyViewedIds(getRecentlyViewed());
    }, [product]);


    const recentlyViewedProducts = useMemo(
        () => recentlyViewedIds
            .map((pid) => products.find((p) => p.id === pid))
            .filter((p) => p && p.id !== product?.id), // don't show the current product itself
        [recentlyViewedIds, product]
    );


    if (!product) return <p>Product not found.</p>

    const increment = () => setAmount((prev) => prev + 1)
    const decrement = () => setAmount((prev) => (prev > 1 ? prev - 1 : 1))

    function handleAddToBag() {
        if (!selectedSize) {
            alert("please select a size")
            return
        }
        addToCart(product, { color: selectedColor, size: selectedSize, quantity: amount })
    }

    function handleBuyNow() {
        if (!selectedSize) {
            alert("please select a size")
            return
        }
        addToCart(product, { color: selectedColor, size: selectedSize, quantity: amount })
        navigate("/checkout")
    }
    return (
        <>
            <div className="product-main">
                <div className="product-display">
                    <div className="thumbnail-list">
                        {product.images.map((img, i) => (
                            <button
                                key={img}
                                className={selectedImage === i ? "thumb active" : "thumb"}
                                onClick={() => setSelectedImage(i)}
                            >
                                <img src={img} alt={`${product.name} view ${i + 1}`} />
                            </button>
                        ))}
                    </div>

                    <div className="main-image">
                        <img src={product.images[selectedImage]} alt={product.name} />
                    </div>
                </div>

                <div className="product-details">
                    <span className="eyebrow">{product.collection}</span>
                    <h1>{product.name}</h1>

                    <div className="rating">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < Math.round(product.rating) ? "#b6502b" : "none"}
                                stroke="#b6502b"
                                strokeWidth={1}
                            />
                        ))}
                        <span className="rating-text">
                            {product.rating} · {product.reviewCount} reviews
                        </span>
                    </div>

                    <div className="price">
                        <span>${product.price.toFixed(2)}</span>
                        {product.compareAt && (
                            <span className="compare-price">${product.compareAt.toFixed(2)}</span>
                        )}
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="option-group">
                        <p className="option-label">Colour: <strong className="blaq">{selectedColor}</strong></p>
                        <div className="option-buttons">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    className={selectedColor === color ? "option-btn active" : "option-btn"}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="option-group">
                        <div className="option-header">
                            <p className="option-label">Size</p>
                            <a href="/size-guide">Size guide</a>
                        </div>
                        <div className="option-buttons">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={selectedSize === size ? "option-btn active" : "option-btn"}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="purchase-row">
                        <div className="quantity-control">
                            <button onClick={decrement}><Minus size={16} /></button>
                            <span>{amount}</span>
                            <button onClick={increment}><Plus size={16} /></button>
                        </div>

                        <button className="add-to-bag" onClick={handleAddToBag}>Add to bag</button>

                        <button onClick={() => toggleFavorites(product.id)} className="wishlist-btn-p">
                            <Heart size={18} fill={favorited ? "#b6502b" : "transparent"} stroke={favorited ? "#b6502b" : "black"} />
                        </button>
                    </div>

                    <NavLink to="/home/checkout">
                        <button className="buy-now" onClick={handleBuyNow}>Buy it now</button>
                    </NavLink>
                </div>
            </div>
            <section className="reviews">
                <div className="reviews-header">
                    <h2>Reviews</h2>
                </div>
                <div className="reviews-main">
                    <div className="star-head">
                        <h2>{product.rating}</h2>
                        <span>
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.round(product.rating) ? "#b6502b" : "none"}
                                    stroke="#b6502b"
                                    strokeWidth={1}
                                />
                            ))}
                        </span>
                        <p>Based on {product.reviewCount} reviews</p>
                    </div>
                    <ul className="reviews-list">
                        {productReviews.map((review) => (
                            <li key={review.id} className="review-item">
                                <div className="review-header">
                                    <div className="review-stars">
                                        <span>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < review.rating ? "#b6502b" : "none"}
                                                    stroke="#b6502b"
                                                    strokeWidth={1}
                                                />
                                            ))}
                                        </span>
                                        <p className="review-title">{review.title}</p>
                                        <span className="review-author">{review.author} <Dot strokeWidth={0.2} color="#746c63" fill="#746c63" /> {review.date}</span>
                                    </div>
                                    <p className="review-comment">{review.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="others">
                <div className="others-header">
                    <h2>You may also like</h2>
                </div>


                <div className="others-main">
                    {relatedProducts.slice(0, 4).map((p) => (
                        <FeaturedCard key={p.id} product={p} />
                    ))}
                </div>
            </section>


            <section className="others">
                <div className="others-header">
                    <h2>Recently viewed</h2>
                </div>

                {recentlyViewedProducts.length > 0 && (
                    <div className="others-main">
                        {recentlyViewedProducts.map((p) => (
                            <FeaturedCard key={p.id} product={p} />
                        ))}
                    </div>
                )}

            </section>
        </>
    )
}


// <nav className="breadcrumb">
//     <NavLink to="/">Home</NavLink>
//     <span>/</span>
//     <NavLink to={`/shop/${product.category}`}>{product.category}</NavLink>
//     <span>/</span>
//     <span className="current">{product.name}</span>
// </nav>