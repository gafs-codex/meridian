import { ArrowRight } from "lucide-react"
import { NavLink } from "react-router-dom"
export default function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-bg"></div>
            <div className="content-cover">
                <div className="hero-content">
                    <span className="eyebrow">Autumn / Winter Collection</span>
                    <h1>Clothes built to <br /> <em>outlast</em> the season.</h1>

                    <p className="hero-text">Twenty-four pieces. Natural fibres, honest construction, and workshops we visit in person.</p>

                    <div className="hero-link">
                        <NavLink to="/home/shop" className="collection">
                            Shop the collection <ArrowRight size={20} />
                        </NavLink>

                        <NavLink className="vsale">
                            view sale
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    )
}