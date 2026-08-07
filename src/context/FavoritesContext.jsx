import { createContext, useContext, useState, useEffect } from "react";
const FavoritesContext = createContext()
const STORAGE_KEY = "favorites"


export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }
        catch {
            return [];
        }
    })


    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites])

    function toggleFavorites(productId) {
        setFavorites((prev) => {
            return prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        })
    }
    function isFavorites(ProductId) {
        return favorites.includes(ProductId)
    }
    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorites, isFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
