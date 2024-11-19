import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBrands, createBrandApi, getBrandByIdApi, updateBrandApi, deleteBrandApi } from "../../api/brand";



const initialState = {
  brands: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getBrand = createAsyncThunk("brand/get-brands", async (thunkAPI) => {
try {
    const data = await getBrands();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createBrand = createAsyncThunk("brand/create-brand", async (data, thunkAPI) => {
  try {
      const result = await createBrandApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getBrandById = createAsyncThunk("brand/get-brand-by-id", async (id, thunkAPI) => {
  try {
      const data = await getBrandByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });


export const updateBrand = createAsyncThunk("brand/update-brand", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateBrandApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteBrand = createAsyncThunk("brand/delete-brand", async (id, thunkAPI) => {
  try {
    const result = await deleteBrandApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});


export const resetState = createAction('Reset_all');


export const brandSlice = createSlice({
    name: "brands",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getBrand.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getBrand.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.brands = action.payload;
        })
        .addCase(getBrand.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createBrand.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createBrand.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdBrand = action.payload;
        })
        .addCase(createBrand.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateBrand.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateBrand.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedBrand = action.payload;
        })
        .addCase(updateBrand.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteBrand.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteBrand.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deteledBrand = action.payload;
        })
        .addCase(deleteBrand.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getBrandById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getBrandById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotBrand = action.payload;
        })
        .addCase(getBrandById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    },
  });

export default brandSlice.reducer;
