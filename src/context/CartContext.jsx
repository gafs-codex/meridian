import { useContext, createContext, useState, useEffect } from "react";

const CartContext = createContext()
const STORAGE_KEY = "cart"


export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    }, [cartItems])


    function addToCart(product, options) {
        const { color, size, quantity } = options
        setCartItems((prev) => {
            const existingIndex = findIndex(item => item.productId === product.id && item.color === color && item.size === size)

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                }
                return updated;
            }

            return [
                ...prev,
                {
                    cartItemId: `${product.id}-${color}-${size}-${Date.now()}`,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    color,
                    size,
                    quantity,
                },
            ];
        })
    }


    function removeFromCart(cartItemId) {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
    }

    function updateQuantity(cartItemId, quantity) {
        setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);


    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, subtotal, itemCount }}>
            {children}
        </CartContext.Provider>
    )
}


export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context
}
