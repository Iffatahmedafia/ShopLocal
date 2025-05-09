import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Load from localStorage
const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;


const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser, // true if user exists
    // accessToken: Cookies.get("accessToken") || null,
   
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Persist to localStorage
      // state.accessToken = action.payload.accessToken;
      // Cookies.set("accessToken", action.payload.accessToken, { expires: 7 }); // 7 days
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); // Clear localStorage on logout   
      
    },
   
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;