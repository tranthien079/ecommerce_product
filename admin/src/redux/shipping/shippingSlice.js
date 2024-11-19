import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getShips, createShipApi, getShipByIdApi, updateShipApi, deleteShipApi } from "../../api/shipping"; 



const initialState = {
  ships: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getShip = createAsyncThunk("ship/get-ships", async (thunkAPI) => {
try {
    const data = await getShips();
    return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const createShip = createAsyncThunk("ship/create-ship", async (data, thunkAPI) => {
  try {
      const result = await createShipApi(data);
      return result;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
});

export const getShipById = createAsyncThunk("ship/get-ship-by-id", async (id, thunkAPI) => {
  try {
      const data = await getShipByIdApi(id);
      return data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const updateShip = createAsyncThunk("ship/update-ship", async ({ id, data }, thunkAPI) => {
  try {
    const result = await updateShipApi({ id, data });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteShip = createAsyncThunk("ship/delete-ship", async (id, thunkAPI) => {
  try {
    const result = await deleteShipApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('Reset_all');

export const ShipSlice = createSlice({
    name: "ships",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(getShip.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getShip.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.ships = action.payload;
        })
        .addCase(getShip.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(createShip.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(createShip.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdShip = action.payload;
        })
        .addCase(createShip.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateShip.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(updateShip.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedShip = action.payload;
        })
        .addCase(updateShip.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteShip.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deleteShip.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedShip = action.payload;
        })
        .addCase(deleteShip.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getShipById.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(getShipById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.gotShip = action.payload;
        })
        .addCase(getShipById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);

    },
  });

export default ShipSlice.reducer;
