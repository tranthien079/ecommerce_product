import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getCategoriesApi } from "../../api/category";

const initialState = {
  category: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllCategory = createAsyncThunk(
  "category/get-category",
  async (thunkAPI) => {
    try {
      const data = await getCategoriesApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');

export const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.category = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState)
      ;
  },
});

export default categorySlice.reducer;
