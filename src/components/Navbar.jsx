import { Search, Heart, User, ShoppingBag, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext'

import '../styles/index.css'

export default function Navbar() {
    const { favorites } = useFavorites();
    const { itemCount } = useCart();




    return (
        <header>
            <p>Complimentary shipping on orders over $150 — code MERIDIAN10 for 10% off</p>
            <div className='sub-header'>
                <div className='menu'>
                    <button>
                        <NavLink to="/">
                            <Menu />
                        </NavLink>
                    </button>
                </div>

                <NavLink to="/" style={{ color: "black", textDecoration: "none" }}>
                    <h1>Meridian</h1>
                </NavLink>
                <nav>
                    <ul>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/shop/women">
                                Women
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/shop/men">
                                Men
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/shop/footwear">
                                Footwear
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/shop/accessories">
                                Accessories
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/sale">
                                Sale
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={({ isActive }) => isActive ? "nav-links active" : "nav-links"} to="/story">
                                Our Story
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className='nav-btn'>
                    <button>
                        <NavLink className="nav-links">
                            <Search strokeWidth={1.5} size={20} />
                        </NavLink>
                    </button>

                    <button className='nav-icon-btn'>
                        <NavLink className="nav-links" to="/favorites">
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
                        <NavLink className="nav-links" to="/cart">
                            <ShoppingBag strokeWidth={1.5} size={20} />
                            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                        </NavLink>
                    </button>


                </div>
            </div>
        </header>
    )
}