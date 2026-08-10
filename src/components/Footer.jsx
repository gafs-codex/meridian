import '../styles/index.css'
import { NavLink } from 'react-router-dom'
export default function Footer() {
    return (
        <footer>
            <div className='main-footer'>
                <div>
                    <h1>Meridian</h1>
                    <p>Considered clothing and leather goods, made in small runs by workshops we know by name.</p>
                </div>


                <div className='footer-box'>
                    <h4>Shop</h4>
                    <ul>
                        <li><NavLink className='link' to="/home/shop/women">Women</NavLink></li>
                        <li><NavLink className='link' to="/home/shop/men">Men</NavLink></li>
                        <li><NavLink className='link' to="/home/shop/footwear">Footwear</NavLink></li>
                        <li><NavLink className="link" to="/home/shop/accessories">Accessories</NavLink></li>
                    </ul>
                </div>

                <div className='footer-box'>
                    <h4>Help</h4>
                    <ul>
                        <li><NavLink className='link'>Contact us</NavLink></li>
                        <li><NavLink className='link'>Shipping & returns</NavLink></li>
                        <li><NavLink className='link'>Track an order</NavLink></li>
                        <li><NavLink className='link'>Our story</NavLink></li>

                    </ul>
                </div>


                <div className='footer-box'>
                    <h4>The Dispatch</h4>
                    <p>New arrivals and workshop notes, twice a month.</p>
                    <form action=""></form>
                </div>

            </div>
            <div className='sub-footer'>
                <p>© 2026 Meridian & Co. A demonstration storefront — no real orders are processed.</p>

                <p>Est. 2014 · Lisbon · Portland</p>
            </div>
        </footer>
    )
}