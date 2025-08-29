import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk for Login API Call
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        values,
        { 
          headers: { 
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid credentials");
    }
  }
);

// ✅ Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      
      // ✅ Clear only auth-related localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        
        // ✅ Store token & user in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions
export const { logoutAction } = authSlice.actions;

// ✅ Export Reducer
export default authSlice.reducer;
