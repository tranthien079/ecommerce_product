import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBlogCategoriesApi } from "../../api/bcategory";

const initialState = {
  bcategory: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllbcategory = createAsyncThunk(
  "bcategory/get-bcategory",
  async (thunkAPI) => {
    try {
      const data = await getBlogCategoriesApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');

export const bcategorySlice = createSlice({
  name: "bcategory",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllbcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllbcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.bcategory = action.payload;
      })
      .addCase(getAllbcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState)
      ;
  },
});

export default bcategorySlice.reducer;
