import React from "react";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/admin/DashboardPage";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import ProductPage from "./pages/admin/ProductPage";
import UserPage from "./pages/admin/UserPage";
import BlogPage from "./pages/admin/BlogPage";

import BrandPage from "./pages/admin/BrandPage";
import CategoryPage from "./pages/admin/CategoryPage";
import OrderPage from "./pages/admin/OrderPage";
import BCategoryPage from "./pages/admin/BCategoryPage";
import CouponPage from "./pages/admin/CouponPage";
import AddBlogPage from "./pages/admin/AddBlogPage";
import AddBCategoryPage from "./pages/admin/AddBCategoryPage";
import AddCategoryPage from "./pages/admin/AddCategoryPage";
import AddBrandPage from "./pages/admin/AddBrandPage";
import AddProductPage from "./pages/admin/AddProductPage";
import LoginPage from "./pages/LoginPage";
import AddCouponPage from "./pages/admin/AddCouponPage";
import SupplierPage from "./pages/admin/SupplierPage";
import AddSupplierPage from "./pages/admin/AddSupplierPage";
import ShippingPage from "./pages/admin/ShippingPage";
import AddShippingPage from "./pages/admin/AddShippingPage";
import ReceiptPage from "./pages/admin/ReceiptPage";
import AddReceiptPage from "./pages/admin/AddReceiptPage";
import DetailProductPage from "./pages/admin/DetailProductPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import ReviewPage from "./pages/admin/ReviewPage";
import AddUserPage from "./pages/admin/AddUserPage";
import TYPE_EMPLOYEE from "./utils/userType.js";
import { useSelector } from "react-redux";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import LayoutSale from "./components/admin/LayoutSale.jsx";
import LayoutInventory from "./components/admin/LayoutInventory.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import {
  AdminRoute,
  SaleRoute,
  InventoryRoute,
} from "./components/LayoutWrapper.jsx";
function App() {
  const userState = useSelector((state) => state.auth.user);
  
  return (
    <ChatContextProvider user={userState}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<LoginPage />} />

          <Route path="/admin" element={userState?.role == 'admin' ? <LayoutAdmin /> :<UnauthorizedPage />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="user" element={<AddUserPage />} />
            <Route path="user/:id" element={<AddUserPage />} />
            <Route path="reviews" element={<ReviewPage />} />
          </Route>

          <Route path="/sale" element={userState?.role == 'sale' ? <LayoutSale /> :<UnauthorizedPage />}>
            <Route index path="blogs" element={<BlogPage />} />
            <Route path="blog" element={<AddBlogPage />} />
            <Route path="blog/:id" element={<AddBlogPage />} />
            <Route path="bcategories" element={<BCategoryPage />} />
            <Route path="bcategory" element={<AddBCategoryPage />} />
            <Route path="bcategory/:id" element={<AddBCategoryPage />} />
            <Route path="brands" element={<BrandPage />} />
            <Route path="brand" element={<AddBrandPage />} />
            <Route path="brand/:id" element={<AddBrandPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="category" element={<AddCategoryPage />} />
            <Route path="category/:id" element={<AddCategoryPage />} />
            <Route path="coupons" element={<CouponPage />} />
            <Route path="coupon" element={<AddCouponPage />} />
            <Route path="coupon/:id" element={<AddCouponPage />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="ship" element={<AddShippingPage />} />
            <Route path="ship/:id" element={<AddShippingPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="order/:id" element={<OrderDetailPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>

          <Route path="/inventory" element={userState?.role == 'inventory' ? <LayoutInventory /> :<UnauthorizedPage />}>
            <Route index path="products" element={<ProductPage />} />
            <Route path="product" element={<AddProductPage />} />
            <Route path="product/:id" element={<AddProductPage />} />
            <Route path="product/view/:id" element={<DetailProductPage />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="supplier" element={<AddSupplierPage />} />
            <Route path="supplier/:id" element={<AddSupplierPage />} />
            <Route path="receipts" element={<ReceiptPage />} />
            <Route path="receipt" element={<AddReceiptPage />} />
            <Route path="receipt/:id" element={<AddReceiptPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
     
      </BrowserRouter>
    </ChatContextProvider>
  );
}

export default App;
