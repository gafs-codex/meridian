import { Link } from "react-router-dom"
import { Heart, Star, Circle } from "lucide-react"
import { useFavorites } from "../context/FavoritesContext";

export default function FeaturedCard({ product }) {
    const { isFavorites, toggleFavorites } = useFavorites()
    const favorited = isFavorites(product.id)

    const COLOR_MAP = {
        Oat: "#ded1bb",
        Charcoal: "#3d3d3c",
        Clay: "#b4694f",
        Indigo: "#33445f",
        Ecru: "#e8e0d1",
        Tan: "#c08a52",
        Black: "#000000",
        White: "#ffffff",
        Bone: "#e6ded0",
        Camel: "#bb8f5b",
        Navy: "#1f2d44",
        Espresso: "#4a2f21",
        Ivory: "#f2ece1",
        Ink: "#22242a",
        Cognac: "#9c5b2c",
        Slate: "#767e86",
        Blue: "#5b7ea8"
    };
    return (
        <Link to={`/home/products/${product.slug}`} className="featured-card">
            <div className="featured-image">
                <div className="badge-group">
                    {product.compareAt && <span className="badge badge-sale">Sale</span>}
                    {product.isNew && <span className="badge badge-new">New</span>}
                    {product.stock <= 6 && (
                        <span className="badge badge-stock">Low Stock</span>
                    )}
                </div>

                <img src={product.images[0]} alt={product.name} />

                <button className="wishlist-btn"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorites(product.id)
                    }}
                >
                    <Heart size={18} fill={favorited ? "#b6502b" : "transparent"} stroke={favorited ? "#b6502b" : "black"} />
                </button>
            </div>

            <div className="featured-info">
                <span className="featured-collection">{product.collection}</span>
                <h3>{product.name}</h3>

                <div className="featured-price">
                    <span className="price">${product.price.toFixed(2)}</span>
                    {product.compareAt && (
                        <span className="compare-price">${product.compareAt.toFixed(2)}</span>
                    )}
                </div>

                <div className="featured-rating">
                    <span className="rating-value">
                        {product.rating >= 4.6 &&
                            Array.from({ length: 5 }, (_, i) => (
                                <Star key={i} fill="#c0392b" stroke="#c0392b" size={18} />
                            ))}
                    </span>

                    <span className="review-count">({product.reviewCount})</span>
                </div>

                <div className="featured-colors">
                    <div className="cirlce">
                        {product.colors.map((color) => {
                            const hex = COLOR_MAP[color]
                            return <Circle key={color} fill={hex} color={color === "White" ? "black" : hex} size={14} strokeWidth={1} />
                        })}
                    </div>
                    <span>{product.colors.length} colours</span>
                </div>
            </div>
        </Link>
    )
}