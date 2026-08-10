import { NavLink } from "react-router-dom"

export default function NotFound() {
    return (
        <main className="not-found-page">
            <h1>404</h1>
            <p>We couldn't find the page you're looking for.</p>
            <NavLink to="/home/shop" className="link">Browse all products</NavLink>
        </main>
    )
}