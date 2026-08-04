import { PackageCheck, RotateCcw, Leaf } from 'lucide-react';

export default function Informatics() {
    return (
        <section className="info-section">
            <div className='info'>
                <PackageCheck color='#b54f2a' size={20} />
                <div>
                    <h5>Free shipping over $150</h5>
                    <p>Carbon-neutral delivery worldwide.</p>
                </div>
            </div>

            <div className='info'>
                <RotateCcw color='#b54f2a' size={20} />
                <div>
                    <h5>30-day returns</h5>
                    <p>Unworn, with tags. No questions.</p>
                </div>
            </div>

            <div className='info'>
                <Leaf color='#b54f2a' size={20} />
                <div>
                    <h5>Traceable</h5>
                    <p>Every mill and tannery named.</p>
                </div>
            </div>
        </section>
    )
}