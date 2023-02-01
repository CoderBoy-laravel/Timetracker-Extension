import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/UserSlice";

export default configureStore({
  reducer: {
    userInfo: userSlice,
  },
});
