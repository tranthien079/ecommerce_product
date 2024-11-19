import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getSuppliers, createSupplierApi, getSupplierByIdApi, updateSupplierApi, deleteSupplierApi } from "../../api/supplier"; 



const initialState = {
  suppliers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getSupplier = createAsyncThunk("supplier/get-suppliers", async (thunkAPI) => {
try {
    const data = await getSuppliers();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createSupplier = createAsyncThunk("supplier/create-supplier", async (data, thunkAPI) => {
  try {
      const result = await createSupplierApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getSupplierById = createAsyncThunk("supplier/get-supplier-by-id", async (id, thunkAPI) => {
  try {
      const data = await getSupplierByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const updateSupplier = createAsyncThunk("supplier/update-supplier", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateSupplierApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteSupplier = createAsyncThunk("supplier/delete-supplier", async (id, thunkAPI) => {
  try {
    const result = await deleteSupplierApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const SupplierSlice = createSlice({
    name: "suppliers",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getSupplier.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getSupplier.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.Suppliers = action.payload;
        })
        .addCase(getSupplier.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createSupplier.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createSupplier.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdSupplier = action.payload;
        })
        .addCase(createSupplier.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateSupplier.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateSupplier.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedSupplier = action.payload;
        })
        .addCase(updateSupplier.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteSupplier.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteSupplier.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedSupplier = action.payload;
        })
        .addCase(deleteSupplier.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getSupplierById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getSupplierById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotSupplier = action.payload;
        })
        .addCase(getSupplierById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);

    },
  });

export default SupplierSlice.reducer;
