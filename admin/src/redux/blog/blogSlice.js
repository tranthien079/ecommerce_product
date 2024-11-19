import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBlogs, createBlogApi, updateBlogApi, getBlogByIdApi, deleteBlogApi } from "../../api/blog";



const initialState = {
  blogs: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getBlog = createAsyncThunk("blog/get-blogs", async (thunkAPI) => {
try {
    const data = await getBlogs();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createBlog = createAsyncThunk("blog/create-blog", async (data, thunkAPI) => {
  try {
      const result = await createBlogApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getBlogById = createAsyncThunk("blog/get-blog-by-id", async (id, thunkAPI) => {
  try {
      const data = await getBlogByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });


export const updateBlog = createAsyncThunk("blog/update-blog", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateBlogApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteBlog = createAsyncThunk("blog/delete-blog", async (id, thunkAPI) => {
  try {
    const result = await deleteBlogApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getBlog.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getBlog.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.blogs = action.payload;
        })
        .addCase(getBlog.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createBlog.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createBlog.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdBlog = action.payload;
        })
        .addCase(createBlog.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateBlog.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateBlog.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedBlog = action.payload;
        })
        .addCase(updateBlog.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteBlog.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteBlog.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deteledBlog = action.payload;
        })
        .addCase(deleteBlog.rejected, (state, action) => {
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
          state.isError = false;
          state.isSuccess = true;
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
