import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../redux/user/userSlice'
import ProductReducer from '../redux/product/productSlice';
import BlogReducer from '../redux/blog/blogSlice';
import ShippingReducer from '../redux/shipping/shippingSlice';
import BcategoryReducer from './blog/bcategorySlice';
import BrandReducer from '../redux/product/brandSlice';
import CategoryReducer from '../redux/product/categorySlice';
export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        product: ProductReducer,
        blog: BlogReducer,
        shipping: ShippingReducer,
        bcategory: BcategoryReducer,
        brand: BrandReducer,
        category: CategoryReducer,
    },
})