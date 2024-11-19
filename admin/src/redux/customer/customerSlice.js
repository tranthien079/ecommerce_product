import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { blockUserApi, getUsers, unBlockUserApi } from "../../api/customer";

const initialState = {
  customers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getUser = createAsyncThunk(
  "customer/get-customers",
  async (thunkAPI) => {
    try {
      const data = await getUsers();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const blockUser = createAsyncThunk(
  "customer/block-customers",
  async (id, thunkAPI) => {
    try {
      const data = await blockUserApi(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const unBlockUser = createAsyncThunk(
  "customer/unblock-customers",
  async (id, thunkAPI) => {
    try {
      const data = await unBlockUserApi(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction("Reset_all");

export const customerSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.customers = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(blockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blockedUser = action.payload;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(unBlockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.unblockedUser = action.payload;
      })
      .addCase(unBlockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export default customerSlice.reducer;
