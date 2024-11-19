import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getBCategories, createBCategoryApi, getBCategoryByIdApi, updateBCategoryApi, deleteBCategoryApi } from "../../api/bcategory";



const initialState = {
  bcategories: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getBCategory = createAsyncThunk("bcategory/get-bcategories", async (thunkAPI) => {
try {
    const data = await getBCategories();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createBCategory = createAsyncThunk("bcategory/create-bcategory", async (data, thunkAPI) => {
try {
    const result = await createBCategoryApi(data);
    return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const getBCategoryById = createAsyncThunk("bcategory/get-bcategory-by-id", async (id, thunkAPI) => {
  try {
      const data = await getBCategoryByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });


export const deleteBCategory = createAsyncThunk("bcategory/delete-bcategory", async (id, thunkAPI) => {
  try {
      const result = await deleteBCategoryApi(id);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const updateBCategory = createAsyncThunk("bcategory/update-bcategory", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateBCategoryApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const bcategory = createSlice({
    name: "bcategories",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getBCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getBCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.bcategories = action.payload;
        })
        .addCase(getBCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createBCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createBCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdBCategory = action.payload;
        })
        .addCase(createBCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getBCategoryById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getBCategoryById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotBCategory = action.payload;
        })
        .addCase(getBCategoryById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateBCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateBCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedBCategory = action.payload;
        })
        .addCase(updateBCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteBCategory.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteBCategory.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedBCategory = action.payload;
        })
        .addCase(deleteBCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    },
  });

export default bcategory.reducer;
