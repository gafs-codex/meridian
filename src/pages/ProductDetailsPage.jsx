import { Heart, Minus, Plus, Star } from "lucide-react"
import { useState } from "react"
import { useParams, NavLink } from "react-router-dom"
import products from '../data/products.json'
import reviews from '../data/reviews.json'

export default function ProductDetailsPage() {
    const { id } = useParams()
    const [amount, setAmount] = useState(1)

    const product = products.find(product => String(product.id) === id)

    const productReviews = reviews.filter(review => String(review.productId) === id)

    const [selectedColor, setSelectedColor] = useState(product?.colors[0])
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)

    if (!product) return <p>Product not found.</p>

    const increment = () => setAmount((prev) => prev + 1)
    const decrement = () => setAmount((prev) => (prev > 1 ? prev - 1 : 1))

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

                        <button className="add-to-bag">Add to bag</button>

                        <button className="wishlist-btn-p">
                            <Heart size={18} />
                        </button>
                    </div>

                    <button className="buy-now">Buy it now</button>
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
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < review.rating ? "#b6502b" : "none"}
                                                stroke="#b6502b"
                                            />
                                        ))}
                                    </div>
                                    <span className="review-author">{review.author}</span>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </li>
                        ))}
                    </ul>
                </div>
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