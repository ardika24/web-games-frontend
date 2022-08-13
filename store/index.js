import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import scoreReducer from "./slices/score";
import roundReducer from "./slices/round";

const store = configureStore({
  reducer: {
    user: userReducer,
    score: scoreReducer,
    round: roundReducer,
  },
});

export default store;
