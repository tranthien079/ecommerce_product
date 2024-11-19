import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Blog from "./pages/Blog";
import ProductItem from "./pages/ProductItem";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import PaymentSuccess from "./pages/PaymentSuccess";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import OrderItem from "./pages/OrderItem";
import Wishlist from "./pages/Wishlist";
import BlogItem from "./pages/BlogItem";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import { ChatContextProvider } from "./context/ChatContext";
import { useSelector } from "react-redux";


const App = () => {
  const userState = useSelector((state) => state.auth.user);
  return (
    
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ChatContextProvider  user={userState}>
      <ToastContainer transition={Bounce} autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogItem />} />
        <Route path="/product/:id" element={<ProductItem />} />
        <Route path="/chat" element={<Chat />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/account" element={<Account />}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<Order />} />
          <Route path="order/:id" element={<OrderItem />} />
        </Route>
        <Route path="/checkout" element={<PlaceOrder />} />
      </Routes>
      <Footer />
    </ChatContextProvider>
    </div>
  );
};

export default App;
