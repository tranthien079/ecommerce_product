import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { loginAdmin, getOrders, createUserApi, getUsersApi, findUserApi, deleteUserApi, updateUserApi }  from "../../api/auth";
import { toast } from "react-toastify";

const getUserFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {};

const initialState = {
  user: getUserFromLocalStorage,
  orders: [],
  isAuthenticated: !!localStorage.getItem("token"),
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const data = await loginAdmin(user);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
  try {
    const data = await createUserApi(user);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteUser = createAsyncThunk("auth/delete", async (id, thunkAPI) => {
  try {
    const data = await deleteUserApi(id);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getOrder = createAsyncThunk("auth/get-orders", async (thunkAPI) => {
  try {
    const data = await getOrders();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const findUser = createAsyncThunk("auth/find-user", async (userId, thunkAPI) => {
  try {
    const result = await findUserApi(userId);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getAllUsers = createAsyncThunk("auth/get-all-user", async (thunkAPI) => {
  try {
    const result = await getUsersApi();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const updateUser = createAsyncThunk("auth/update-user", async (data, thunkAPI) => {
  try {
    const result = await updateUserApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutAuth: (state, action) => {
      state.user = {};
      state.isAuthenticated = false;
      localStorage.removeItem("token");

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload?.token);
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success('Đăng nhập thành công!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deletedUser = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orders = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
.addCase(findUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.findedUser = action.payload;
      })
      .addCase(findUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.getAllUser = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(resetState, () => initialState);
  },
});

export default authSlice.reducer;
export const { logoutAuth } = authSlice.actions;
