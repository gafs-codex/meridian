import { Heart, Minus, Plus, Star, Dot } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";

import reviews from "../data/reviews.json";
import FeaturedCard from "../ui/FeaturedCard";

import { addRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useToast } from '../context/ToastContext'

import {
    getProductBySlug,
    getProducts
} from "../lib/products";

export default function ProductDetailsPage() {
    const { isFavorites, toggleFavorites } = useFavorites();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { slug } = useParams();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);

                const data = await getProductBySlug(slug);

                setProduct(data);

                if (data?.colors?.length > 0) {
                    setSelectedColor(data.colors[0]);
                }

            } catch (error) {
                console.error("Failed to load product:", error);
                setError("Unable to load product.");
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchProduct();
        }
    }, [slug]);


    useEffect(() => {
        async function fetchAllProducts() {
            try {
                const data = await getProducts();
                setAllProducts(data);
            } catch (error) {
                console.error("Failed to load products:", error);
            }
        }

        fetchAllProducts();
    }, []);



    useEffect(() => {
        if (!product) return;

        addRecentlyViewed(product.id);
        setRecentlyViewedIds(getRecentlyViewed());
    }, [product]);


    const productReviewData = product
        ? reviews.find(
            review => String(review.productId) === String(product.id)
        )
        : null;

    const productReviews = productReviewData
        ? productReviewData.reviews
        : [];



    const favorited = product
        ? isFavorites(product.id)
        : false;



    const relatedProducts = useMemo(() => {
        if (!product) return [];

        return allProducts
            .filter(
                p =>
                    p.category === product.category &&
                    p.id !== product.id
            )
            .slice(0, 4);

    }, [allProducts, product]);


    const recentlyViewedProducts = useMemo(() => {
        if (!product) return [];

        return recentlyViewedIds
            .map(pid =>
                allProducts.find(
                    p => String(p.id) === String(pid)
                )
            )
            .filter(
                p =>
                    p &&
                    String(p.id) !== String(product.id)
            );

    }, [recentlyViewedIds, allProducts, product]);



    if (loading) {
        return <p>Loading product...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }



    if (!product) {
        return <p>Product not found.</p>;
    }


    const productImages = Array.isArray(product.images)
        ? product.images
        : product.images
            ? [product.images]
            : [];



    const increment = () => {
        setAmount(prev => prev + 1);
    };

    const decrement = () => {
        setAmount(prev => prev > 1 ? prev - 1 : 1);
    };


    function handleAddToBag() {
        if (!selectedSize) {
            showToast("Please select a size", "error");
            return;
        }

        addToCart(product, { color: selectedColor, size: selectedSize, quantity: amount });
        showToast(`${product.name} added to your bag`, "success");
    }



    function handleBuyNow() {
        if (!selectedSize) {
            showToast("Please select a size", "error");
            return;
        }
        addToCart(product, { color: selectedColor, size: selectedSize, quantity: amount });
        navigate("/home/checkout");
    }


    return (
        <>
            <div className="product-main">

                <div className="product-display">

                    <div className="thumbnail-list">

                        {productImages.map((img, i) => (
                            <button
                                key={img}
                                className={
                                    selectedImage === i
                                        ? "thumb active"
                                        : "thumb"
                                }
                                onClick={() => setSelectedImage(i)}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} view ${i + 1}`}
                                />
                            </button>
                        ))}

                    </div>


                    <div className="main-image">
                        {productImages.length > 0 && (
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                            />
                        )}

                    </div>

                </div>


                <div className="product-details">
                    <span className="eyebrow">
                        {product.collection}
                    </span>

                    <h1>{product.name}</h1>


                    <div className="rating">

                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={
                                    i < Math.round(product.rating)
                                        ? "#b6502b"
                                        : "none"
                                }
                                stroke="#b6502b"
                                strokeWidth={1}
                            />
                        ))}

                        <span className="rating-text">
                            {product.rating} · {product.reviewCount} reviews
                        </span>

                    </div>


                    <div className="price">

                        <span>
                            ${Number(product.price).toFixed(2)}
                        </span>

                        {product.compareAt && (
                            <span className="compare-price">
                                ${Number(product.compareAt).toFixed(2)}
                            </span>
                        )}

                    </div>


                    <p className="description">
                        {product.description}
                    </p>




                    <div className="option-group">
                        <p className="option-label">
                            Colour:{" "}
                            <strong className="blaq">
                                {selectedColor}
                            </strong>
                        </p>

                        <div className="option-buttons">

                            {product.colors?.map(color => (
                                <button
                                    key={color}
                                    className={
                                        selectedColor === color
                                            ? "option-btn active"
                                            : "option-btn"
                                    }
                                    onClick={() =>
                                        setSelectedColor(color)
                                    }
                                >
                                    {color}
                                </button>
                            ))}

                        </div>

                    </div>




                    <div className="option-group">
                        <div className="option-header">
                            <p className="option-label">
                                Size
                            </p>
                            <a href="/size-guide">
                                Size guide
                            </a>
                        </div>


                        <div className="option-buttons">
                            {product.sizes?.map(size => (
                                <button
                                    key={size}
                                    className={
                                        selectedSize === size
                                            ? "option-btn active"
                                            : "option-btn"
                                    }
                                    onClick={() =>
                                        setSelectedSize(size)
                                    }
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>




                    <div className="purchase-row">
                        <div className="quantity-control">
                            <button onClick={decrement}>
                                <Minus size={16} />
                            </button>

                            <span>{amount}</span>

                            <button onClick={increment}>
                                <Plus size={16} />
                            </button>
                        </div>


                        <button
                            className="add-to-bag"
                            onClick={handleAddToBag}
                        >
                            Add to bag
                        </button>


                        <button
                            onClick={() =>
                                toggleFavorites(product.id)
                            }
                            className="wishlist-btn-p"
                        >
                            <Heart size={18} fill={favorited ? "#b6502b" : "transparent"}
                                stroke={favorited ? "#b6502b" : "black"}
                            />
                        </button>
                    </div>


                    <button
                        className="buy-now"
                        onClick={handleBuyNow}
                    >
                        Buy it now
                    </button>
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
                            {Array.from(
                                { length: 5 },
                                (_, i) => (
                                    <Star key={i} size={16} fill={i < Math.round(product.rating) ? "#b6502b" : "none"}
                                        stroke="#b6502b"
                                        strokeWidth={1}
                                    />
                                )
                            )}
                        </span>

                        <p>
                            Based on {product.reviewCount} reviews
                        </p>
                    </div>


                    <ul className="reviews-list">
                        {productReviews.map(review => (
                            <li
                                key={review.id}
                                className="review-item"
                            >
                                <div className="review-header">
                                    <div className="review-stars">
                                        <span>
                                            {Array.from(
                                                { length: 5 },
                                                (_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "#b6502b" : "none"}
                                                        stroke="#b6502b"
                                                        strokeWidth={1}
                                                    />
                                                )
                                            )}
                                        </span>

                                        <p className="review-title">
                                            {review.title}
                                        </p>

                                        <span className="review-author">
                                            {review.author}
                                            <Dot
                                                strokeWidth={0.2}
                                                color="#746c63"
                                                fill="#746c63"
                                            />
                                            {review.date}
                                        </span>
                                    </div>

                                    <p className="review-comment">
                                        {review.body}
                                    </p>
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

                    {relatedProducts.map(product => (
                        <FeaturedCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>

            </section>

            <section className="others">

                <div className="others-header">
                    <h2>Recently viewed</h2>
                </div>


                {recentlyViewedProducts.length > 0 && (

                    <div className="others-main">

                        {recentlyViewedProducts.map(product => (
                            <FeaturedCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>

                )}

            </section>

        </>
    );
}