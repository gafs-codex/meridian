import { NavLink } from 'react-router-dom'
import heroImage from '../assets/hero.jpg'
export default function Story() {
    return (
        <section className="story">
            <p>Our Story</p>
            <h1>Fewer, better things — made to be kept</h1>
            <img src={heroImage} alt="Meridian & Co atelier" />

            <div className='story-details'>
                <div className='text'>
                    <p>Meridian & Co began in a two-room studio with a single question: what would a wardrobe look like if nothing in it were disposable? We answered it slowly — one coat, one boot, one knit at a time.</p>

                    <p>Every piece is produced in runs of a few hundred with mills and workshops we visit in person. Our wool comes from a family spinner in Biella, our leather from a vegetable-tanned yard outside Santa Croce.</p>

                    <p>We publish our sizing honestly, repair what we make, and keep the archive alive rather than chasing fifty-two micro-seasons a year.</p>
                </div>


                <dl>
                    <div>
                        <dt>2016</dt>
                        <dd>Founded in Lisbon</dd>
                    </div>

                    <div>
                        <dt>4</dt>
                        <dd>Partner mills</dd>
                    </div>

                    <div>
                        <dt>87%</dt>
                        <dd>Natrual fibres</dd>
                    </div>

                    <div>
                        <dt>30 days</dt>
                        <dd>Free return</dd>
                    </div>
                </dl>
            </div>

            <NavLink to="/shop">
                <button>
                    Shop the collection
                </button>
            </NavLink>
        </section>
    )
}