import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShopLayout from './layout/ShopLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Favorites from './pages/Favorites'
import Story from './pages/Story'
import Cart from './pages/Cart'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'

function App() {


  return (
    <>
      <FavoritesProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<ShopLayout />}>
                <Route index element={<Home />} />
                <Route path='shop' element={<Shop />} />
                <Route path='shop/:category' element={<Shop />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path='favorites' element={<Favorites />} />
                <Route path='story' element={<Story />} />
                <Route path='cart' element={<Cart />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </FavoritesProvider>
    </>
  )
}

export default App
