import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getOrderDetailApi, getOrders, updateOrderStatusApi } from "../../api/auth";
import { toast } from "react-toastify";

const initialState = {
  orders: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getOrder = createAsyncThunk(
  "order/get-orders",
  async (thunkAPI) => {
    try {
      const data = await getOrders();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);


export const updateOrderStatus = createAsyncThunk(
  "order/update-order",
  async (data, thunkAPI) => {
    try {
      const result = await updateOrderStatusApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      const result = await getOrderDetailApi(id);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);


export const resetState = createAction('Reset_all');


export const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orders = action.payload;
        state.gotOrder = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.gotOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedOrder = action.payload;
       toast.success('Cập nhật trạng thái đơn hàng thành công')
        
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);

  },
});

export default orderSlice.reducer;
