import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/auth/authSlice";
import CustomerReducer from "../redux/customer/customerSlice";
import ProductReducer from "../redux/product/productSlice";
import BrandReducer from "../redux/brand/brandSlice";
import CategoryReducer from "../redux/category/categorySlice";
import BCategoryReducer  from "../redux/bcategory/bcategorySlice";
import BlogReducer  from "../redux/blog/blogSlice";
import CouponReducer  from "../redux/coupon/couponSlice";
import OrderReducer from "../redux/order/orderSlice";
import UploadReducer from "../redux/upload/uploadSlice";
import SupplierReducer from "../redux/supplier/supplierSlice";
import ShipReducer from "../redux/shipping/shippingSlice";
import ReceiptReducer from "../redux/receipt/receiptSlice";
import DashboardReducer from "../redux/dashboard/dashboardSlice";
import ReviewReducer from "../redux/review/reviewSlice";
export const store = configureStore({
  reducer: { 
    auth: AuthReducer, 
    customers: CustomerReducer, 
    products: ProductReducer, 
    brands: BrandReducer, 
    categories: CategoryReducer,
    bcategories: BCategoryReducer,
    blogs: BlogReducer,
    coupons: CouponReducer,
    orders: OrderReducer,
    suppliers: SupplierReducer,
    ships: ShipReducer,
    receipts: ReceiptReducer,
    images: UploadReducer,
    dashboard: DashboardReducer,  
    reviews: ReviewReducer, 
  }, 

});
