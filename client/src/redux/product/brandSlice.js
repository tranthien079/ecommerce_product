import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBrandsApi } from "../../api/brand";

const initialState = {
  brand: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllBrand = createAsyncThunk(
  "brand/get-brand",
  async (thunkAPI) => {
    try {
      const data = await getBrandsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');

export const brandSlice = createSlice({
  name: "brand",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.brand = action.payload;
      })
      .addCase(getAllBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState)
      ;
  },
});

export default brandSlice.reducer;
