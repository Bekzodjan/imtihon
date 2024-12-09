import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOnlineUsers = createAsyncThunk(
  "users/fetchOnlineUsers",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/online", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    onlineUsers: [],
    status: "idle", // "loading", "succeeded", "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnlineUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOnlineUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.onlineUsers = action.payload;
      })
      .addCase(fetchOnlineUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
