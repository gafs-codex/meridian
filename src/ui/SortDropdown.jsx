import { useState } from "react";
import { ChevronDown } from "lucide-react"

const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Top Rated", value: "rating" },
]

export default function SortDropdown({ sortBy, setSortBy }) {
    const [open, setOpen] = useState(false);
    const current = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0]

    return (
        <div className="sort-dropdown">
            <button className="sort-trigger" onClick={() => setOpen(prev => !prev)}>
                <span>{current.label.toUpperCase()}</span>
                <ChevronDown size={16} className={open ? "chev open" : "chev"} />
            </button>


            {open && (
                <ul className="sort-menu">
                    {sortOptions.map((option) => {
                        return <li
                            key={option.value}
                            className={option.value === sortBy ? "sort-item active" : "sort-item"}
                            onClick={() => {
                                setSortBy(option.value)
                                setOpen(false)
                            }}
                        >
                            {option.label.toUpperCase()}
                        </li>
                    })}
                </ul>
            )}
        </div>


    )
}