import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getCategories, createCategoryApi, getCategoryByIdApi, deleteCategoryApi, updateCategoryApi } from "../../api/category";



const initialState = {
  categories: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getCategory = createAsyncThunk("category/get-categories", async (thunkAPI) => {
try {
    const data = await getCategories();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createCategory = createAsyncThunk("category/create-category", async (data, thunkAPI) => {
  try {
      const result = await createCategoryApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getCategoryById = createAsyncThunk("category/get-category-by-id", async (id, thunkAPI) => {
  try {
      const data = await getCategoryByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });


export const deleteCategory = createAsyncThunk("category/delete-category", async (id, thunkAPI) => {
  try {
      const result = await deleteCategoryApi(id);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const updateCategory = createAsyncThunk("category/update-category", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateCategoryApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const brandSlice = createSlice({
    name: "categories",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.categories = action.payload;
          state.gotCategory = null;
        })
        .addCase(getCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdCategory = action.payload;
        })
        .addCase(createCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getCategoryById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getCategoryById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotCategory = action.payload;
        })
        .addCase(getCategoryById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedCategory = action.payload;
        })
        .addCase(updateCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedCategory = action.payload;
        })
        .addCase(deleteCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    },
  });

export default brandSlice.reducer;
