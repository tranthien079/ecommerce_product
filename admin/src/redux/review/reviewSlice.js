import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getReviewsApi, updateShowCommentApi } from "../../api/product";

const initialState = {
  reviews: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getReview = createAsyncThunk(
  "review/get-reviews",
  async (thunkAPI) => {
    try {
      const data = await getReviewsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/update-review",
  async (data, thunkAPI) => {
    try {
      const result = await updateShowCommentApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction("Reset_all");

export const couponSlice = createSlice({
  name: "reviews",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.reviews = action.payload;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.reviews = action.payload;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export default couponSlice.reducer;
