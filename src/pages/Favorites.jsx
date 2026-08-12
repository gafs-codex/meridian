import { useFavorites } from "../context/FavoritesContext"
import prdoucts from '../data/products/products.json'
import FeaturedCard from "../ui/FeaturedCard"
import { NavLink } from "react-router-dom"
export default function Favorites() {
    const { favorites } = useFavorites()

    const favoriteProduct = favorites.map((favorite) => {
        return prdoucts.find(product => product.id === favorite)
    }).filter(Boolean)
    return (
        <section className="favorites">
            <div className="favorites-header">
                <h1>Favorites</h1>
                <p>{favoriteProduct.length} saved piece</p>
            </div>

            <div className="favorites-main">
                {favoriteProduct.length === 0 ? (
                    <div className="favorites-empty">
                        <p>Nothing saved yet — tap the heart on any piece to keep it here.</p>

                        <NavLink to="/shop">
                            <button className="favorites-link">Browse the collection</button>
                        </NavLink>
                    </div>
                ) : (
                    <div className="show-favorites">
                        {favoriteProduct.map((product) => {
                            return <FeaturedCard key={product.id} product={product} />
                        })}
                    </div>
                )
                }
            </div>
        </section>
    )
}