import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import baseUrl from "./baseUrl";
import authToken from "./authToken";
import pageSlice from "./page";

export default configureStore({
  reducer: {
    user: userSlice,
    baseurl: baseUrl,
    authToken: authToken,
    page: pageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});