import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBlogsApi, getBlogByIdApi } from "../../api/blog";
import { toast } from "react-toastify";

const initialState = {
  blog: "",
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getAllBlog = createAsyncThunk(
  "blog/get-blogs",
  async (data,thunkAPI) => {
    try {
      const result = await getBlogsApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getBlogById = createAsyncThunk(
  "blog/get-blog-id",
  async (id, thunkAPI) => {
    try {
      const data = await getBlogByIdApi(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction('Reset_all');
export const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blog = action.payload;
        state.gotBlog = null;
      })
      .addCase(getAllBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.gotBlog = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export default blogSlice.reducer;
