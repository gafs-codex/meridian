import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShopLayout from './layout/ShopLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetailsPage from './pages/ProductDetailsPage'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path='shop' element={<Shop />} />
            <Route path='shop/:category' element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
