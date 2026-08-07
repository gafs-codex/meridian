import { useFavorites } from "../context/FavoritesContext"
import prdoucts from '../data/products.json'
import FeaturedCard from "../ui/FeaturedCard"
import { NavLink } from "react-router-dom"
export default function Favorites() {
    const { favorites } = useFavorites()

    const favoriteProduct = favorites.map((favorite) => {
        return prdoucts.find(product => product.id === favorite)
    }).filter(Boolean)
    return (
        <div>

        </div>
    )
}