import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "../store/slices/groupSlice";
import authReducer from "./authSlice"; // Login uchun mavjud bo'lishi kerak
import userReducer from "../store/slices/usersSlice";

const store = configureStore({
  reducer: {
    groups: groupReducer,
    auth: authReducer,
    users: userReducer
  },
});

export default store;
