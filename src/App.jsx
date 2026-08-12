import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShopLayout from './layout/ShopLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Favorites from './pages/Favorites'
import Story from './pages/Story'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import SearchPage from './pages/Search'
import NotFound from './pages/NotFound'
import Auth from './pages/Register'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

console.log("Supabase URL:", supabase.supabaseUrl);

function App() {

  return (
    <>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Auth />} />

                <Route path='/home' element={<ShopLayout />}>
                  <Route index element={<Home />} />
                  <Route path='shop' element={<Shop />} />
                  <Route path='shop/:category' element={<Shop />} />
                  <Route path="products/:slug" element={<ProductDetailsPage />} />
                  <Route path='favorites' element={<Favorites />} />
                  <Route path='story' element={<Story />} />
                  <Route path='cart' element={<Cart />} />
                  <Route path='search' element={<SearchPage />} />
                  <Route path='checkout' element={<Checkout />} />
                </Route>
                <Route path='*' element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </>
  )
}

export default App
