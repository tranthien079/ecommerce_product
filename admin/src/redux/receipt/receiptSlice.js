import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getReceipts, createReceiptApi, getReceiptByIdApi, updateReceiptApi, deleteReceiptApi } from "../../api/receipt"; 



const initialState = {
  receipts: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getReceipt = createAsyncThunk("receipt/get-receipts", async (thunkAPI) => {
try {
    const data = await getReceipts();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createReceipt = createAsyncThunk("receipt/create-receipt", async (data, thunkAPI) => {
  try {
      const result = await createReceiptApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getReceiptById = createAsyncThunk("receipt/get-receipt-by-id", async (id, thunkAPI) => {
  try {
      const data = await getReceiptByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const updateReceipt = createAsyncThunk("receipt/update-receipt", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateReceiptApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteReceipt = createAsyncThunk("receipt/delete-receipt", async (id, thunkAPI) => {
  try {
    const result = await deleteReceiptApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const receiptSlice = createSlice({
    name: "receipts",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getReceipt.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getReceipt.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.receipts = action.payload;
        })
        .addCase(getReceipt.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createReceipt.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createReceipt.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdReceipt = action.payload;
        })
        .addCase(createReceipt.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateReceipt.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateReceipt.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedReceipt = action.payload;
        })
        .addCase(updateReceipt.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteReceipt.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteReceipt.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedReceipt = action.payload;
        })
        .addCase(deleteReceipt.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getReceiptById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getReceiptById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotReceipt = action.payload;
        })
        .addCase(getReceiptById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);

    },
  });

export default receiptSlice.reducer;
