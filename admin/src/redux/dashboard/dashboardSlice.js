import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import {
  getDailyRevenueApi,
  getDashboardApi,
  getMonthlyRevenueApi,
  getQuaterlyRevenueApi,
  getYearlyRevenueApi,
} from "../../api/dashboard";

const initialState = {
  dashboard: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getDashboard = createAsyncThunk(
  "dashboard/get-dashboard",
  async (thunkAPI) => {
    try {
      const data = await getDashboardApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getDailyRevenue = createAsyncThunk(
  "dashboard/get-dashboardDaily",
  async (data, thunkAPI) => {
    try {
      const result = await getDailyRevenueApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getMonthlyRevenue = createAsyncThunk(
  "dashboard/get-dashboardMonthly",
  async (data, thunkAPI) => {
    try {
      const result = await getMonthlyRevenueApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getQuaterlyRevenue = createAsyncThunk(
  "dashboard/get-dashboardQuaterly",
  async (data, thunkAPI) => {
    try {
      const result = await getQuaterlyRevenueApi(data);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const getYearlyRevenue = createAsyncThunk(
  "dashboard/get-dashboardYearly",
  async (year, thunkAPI) => {
    try {
      const result = await getYearlyRevenueApi(year);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const resetState = createAction("Reset_all");

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dashboard = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getDailyRevenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDailyRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dailyRevenue = action.payload;
      })
      .addCase(getDailyRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getQuaterlyRevenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuaterlyRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.quarterlyRevenue = action.payload;
      })
      .addCase(getQuaterlyRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getMonthlyRevenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.monthlyRevenue = action.payload;
      })
      .addCase(getMonthlyRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getYearlyRevenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getYearlyRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.yearlyRevenue = action.payload;
      })
      .addCase(getYearlyRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export default dashboardSlice.reducer;
