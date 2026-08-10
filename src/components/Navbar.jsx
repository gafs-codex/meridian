import { Search, Heart, User, ShoppingBag, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate,useSearchParams } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext'


import '../styles/index.css'

export default function Navbar() {
    const navigate = useNavigate()
    const { favorites } = useFavorites();
    const { itemCount } = useCart();
    const [search, setSearched] = useState(false);
    const [input, setInput] = useState("");
    const [item, setItem] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // useEffect(() => {
    //     if (!item) return
    //         const result = 
    // }, [])

    // const searchResults = item ? products.filter(proudct => proudct.name.toLowerCase.includes(item)) : [];

    function handleSearch() {
        setSearched(prev => !prev)
    }
    function handleSubmit(e) {
        e.preventDefault();
        const trim = input.trim();
        navigate(`/home/search?q=${encodeURIComponent(trim)}`)
    }


    return (
        <header>
            <p>Complimentary shipping on orders over $150 — code MERIDIAN10 for 10% off</p>
            <div className='sub-header'>
                <div className='menu'>
                    <button>
                        <NavLink to="/home" className="menu-link">
                            <Menu />
                        </NavLink>
                    </button>
                </div>

                <NavLink to="/home" style={{ color: "black", textDecoration: "none" }}>
                    <h1>Meridian</h1>
                </NavLink>
                <nav>
                    <ul>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/shop/women">
                                Women
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/shop/men">
                                Men
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/shop/footwear">
                                Footwear
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/shop/accessories">
                                Accessories
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/shop?sale=true">
                                Sale
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/home/story">
                                Our Story
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className='nav-btn'>
                    <button onClick={handleSearch}>
                        <NavLink className="nav-links">
                            <Search strokeWidth={1.5} size={20} />
                        </NavLink>
                    </button>

                    <button className='nav-icon-btn'>
                        <NavLink className="nav-links" to="/home/favorites">
                            <Heart strokeWidth={1.5} size={20} />
                            {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
                        </NavLink>
                    </button>

                    <button>
                        <NavLink className="nav-links">
                            <User strokeWidth={1.5} size={20} />
                        </NavLink>
                    </button>

                    <button className='nav-icon-btn'>
                        <NavLink className="nav-links" to="/home/cart">
                            <ShoppingBag strokeWidth={1.5} size={20} />
                            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                        </NavLink>
                    </button>


                </div>
            </div>
            <form onSubmit={handleSubmit} className={search ? 'nav-form' : 'show'}>
                <div>
                    <Search size={20} color="#746c63" />
                    <input
                        type="text"
                        placeholder="Search for coats, boots, leather goods..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type='submit'>
                        search
                    </button>
                </div>
            </form>
        </header>

    )
}