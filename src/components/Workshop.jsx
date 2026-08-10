import { NavLink } from "react-router-dom"
import { MoveRight } from 'lucide-react';

export default function Workshop() {
    return (
        <section className="workshop">
            <div className="workshop-header">
                <span>The workshop</span>
                <h2>Fewer things <br /> <em>Made properly</em></h2>
            </div>

            <p>We release two collections a year and re-make what works. Every garment carries the name of the mill that wove it and the workshop that cut it — because a piece you can repair is a piece you keep. <NavLink className="stroy-link" to="/home/story">Read our story</NavLink> </p>
        </section>
    )
}