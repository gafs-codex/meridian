import { BrowserRouter, Routes, Route } from "react-router-dom";

import ShopLayout from "./layout/ShopLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Favorites from "./pages/Favorites";
import Story from "./pages/Story";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SearchPage from "./pages/Search";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Register";
import User from "./pages/User";
import ProtectedRoute from "./components/ProtectedRoute";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, session, loading } = useAuth();

  console.log("Auth loading:", loading);
  console.log("Auth user:", user);
  console.log("Auth session:", session);

  return (
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Auth />} />

            <Route path="/home" element={
              <ProtectedRoute>
                <ShopLayout />
              </ProtectedRoute>
            }>

              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/:category" element={<Shop />} />
              <Route path="products/:slug" element={<ProductDetailsPage />} />
              <Route path="user" element={<User />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="story" element={<Story />} />
              <Route path="cart" element={<Cart />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>


            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}


export default App;