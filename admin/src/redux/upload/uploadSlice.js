import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { uploadImage, deleteImage } from "../../api/upload"; 



const initialState = {
  images: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const uploadImages = createAsyncThunk("upload/images", async (acceptedFiles,thunkAPI) => {
try {
    const formData = new FormData();
    for (let i=0;i<acceptedFiles.length;i++) {
        formData.append("images", acceptedFiles[i]);
      }
    const result = await uploadImage(formData);
    return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

export const deteleImage = createAsyncThunk("upload/delete-images", async (public_id,thunkAPI) => {
  try {
      const result = await deleteImage(public_id);
      return public_id;
      } catch (error) {
          return thunkAPI.rejectWithValue(error?.message);
      }
  });

export const resetState = createAction('Reset_all');

export const uploadSlice = createSlice({
    name: "images",
    initialState,
    extraReducers: (builder) => {
      builder
        .addCase(uploadImages.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(uploadImages.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.images = action.payload;
        })
        .addCase(uploadImages.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deteleImage.pending, (state) => {
          state.isLoading = true; 
        })
        .addCase(deteleImage.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.images = state.images.filter(img => img.public_id !== action.payload);
        })
        .addCase(deteleImage.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    },
  });

export default uploadSlice.reducer;
