import Hero from "../components/Hero"
import Informatics from "../components/Infomatics"
import ShopByCategory from "../components/ShopByCategory"
import FeaturedPieces from "../components/FeaturedPieces"
import Workshop from "../components/Workshop"
import OnSale from "../components/OnSale"


export default function Home() {
    return (
        <main>
            <Hero />
            <Informatics />
            <ShopByCategory />
            <FeaturedPieces />
            <Workshop />
            <OnSale />
        </main>
    )
}