import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getShippingApi } from "../../api/shipping";

const initialState = {
  shipping: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllShipping = createAsyncThunk(
  "shipping/get-shipping",
  async (thunkAPI) => {
    try {
      const data = await getShippingApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');

export const shippingSlice = createSlice({
  name: "shipping",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllShipping.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllShipping.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.shipping = action.payload;
      })
      .addCase(getAllShipping.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState)
      ;
  },
});

export default shippingSlice.reducer;
