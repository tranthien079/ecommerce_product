import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getProductsApi, addToWishListApi, getProductByIdApi, ratingProductApi, relatedProductApi } from "../../api/product";
import { toast } from "react-toastify";

const initialState = {
  product: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllProduct = createAsyncThunk(
  "product/get-products",
  async (data, thunkAPI) => {
    try {
      const result = await getProductsApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);


export const getProductById = createAsyncThunk(
  "product/get-product",
  async (id, thunkAPI) => {
    try {
      const data = await getProductByIdApi(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  "product/get-relate-product",
  async (data, thunkAPI) => {
    try {
      const result = await relatedProductApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const addToWishList = createAsyncThunk(
  "product/add-wishlist",
  async (id, thunkAPI) => {
    try {
      const data = await addToWishListApi(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const ratingProduct = createAsyncThunk(
  "product/rating",
  async (data, thunkAPI) => {
    try {
      const result = await ratingProductApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.gotProduct = null;
        state.product = action.payload.products;
        state.pageCurrent = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addToWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.addedToWishList = action.payload;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.gotProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getRelatedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.relatedProduct = action.payload;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(ratingProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ratingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Đánh giá sản phẩm thành công");
        state.ratedProduct = action.payload;
      })
      .addCase(ratingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState)
      ;
  },
});

export default productSlice.reducer;
