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

                    <div className="hero-buttons">
                        <NavLink className="link" to='/shop'>
                            <button className="collection">Shop the Collection <ArrowRight strokeWidth={1.5} /></button>
                        </NavLink>

                        <button className="sale">View sale</button>
                    </div>
                </div>
            </div>
        </section>
    )
}