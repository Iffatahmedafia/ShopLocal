import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const initialState = {
    user: null,
    isAuthenticated: false,
    // accessToken: Cookies.get("accessToken") || null,
   
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // state.accessToken = action.payload.accessToken;
      // Cookies.set("accessToken", action.payload.accessToken, { expires: 7 }); // 7 days
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
    },
   
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;