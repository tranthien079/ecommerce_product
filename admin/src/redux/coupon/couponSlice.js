import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getCoupons, createCouponApi, getCouponByIdApi, updateCouponApi, deleteCouponApi } from "../../api/coupon"; 



const initialState = {
  coupons: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getCoupon = createAsyncThunk("coupon/get-coupons", async (thunkAPI) => {
try {
    const data = await getCoupons();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createCoupon = createAsyncThunk("coupon/create-coupon", async (data, thunkAPI) => {
  try {
      const result = await createCouponApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getCouponById = createAsyncThunk("coupon/get-coupon-by-id", async (id, thunkAPI) => {
  try {
      const data = await getCouponByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const updateCoupon = createAsyncThunk("coupon/update-coupon", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateCouponApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteCoupon = createAsyncThunk("coupon/delete-coupon", async (id, thunkAPI) => {
  try {
    const result = await deleteCouponApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const couponSlice = createSlice({
    name: "coupons",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getCoupon.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getCoupon.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.coupons = action.payload;
        })
        .addCase(getCoupon.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createCoupon.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createCoupon.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdCoupon = action.payload;
        })
        .addCase(createCoupon.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateCoupon.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateCoupon.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedCoupon = action.payload;
        })
        .addCase(updateCoupon.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteCoupon.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteCoupon.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedCoupon = action.payload;
        })
        .addCase(deleteCoupon.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getCouponById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getCouponById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotCoupon = action.payload;
        })
        .addCase(getCouponById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);

    },
  });

export default couponSlice.reducer;
