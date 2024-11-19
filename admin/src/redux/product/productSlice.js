import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getProducts, createProductApi, updateProductApi, deleteProductApi, getProductByIdApi } from "../../api/product";

const initialState = {
  products: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getProduct = createAsyncThunk("product/get-products", async (thunkAPI) => {
try {
    const data = await getProducts();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createProduct = createAsyncThunk("product/create-product", async (data, thunkAPI) => {
  try {
      const result = await createProductApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const getProductById = createAsyncThunk("product/get-product-by-id", async (id, thunkAPI) => {
  try {
      const data = await getProductByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const updateProduct = createAsyncThunk("product/update-product", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateProductApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteProduct = createAsyncThunk("product/delete-product", async (id, thunkAPI) => {
  try {
    const result = await deleteProductApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const productSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getProduct.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.products = action.payload.products;
          state.gotProduct = null;
        })
        .addCase(getProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createProduct.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdProduct = action.payload;
        })
        .addCase(createProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })        
        .addCase(updateProduct.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedProduct = action.payload;
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteProduct.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedProduct = action.payload;
        })
        .addCase(deleteProduct.rejected, (state, action) => {
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
          state.isError = false;
          state.isSuccess = true;
          state.gotProduct = action.payload?.productWithStock;
        })
        .addCase(getProductById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);

    },
  });

export default productSlice.reducer;
