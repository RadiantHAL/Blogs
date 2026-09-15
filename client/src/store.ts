import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/redux/app/authSlice";
import loadingReducer from "./features/auth/redux/app/loadingSlice";
import blogsReducer from "./features/main/redux/app/BlogsSlice";
import { useDispatch, useSelector } from "react-redux";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    blogs: blogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();