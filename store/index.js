import { configureStore } from "@reduxjs/toolkit";
import scoreReducer from "./slices/score";
import roundReducer from "./slices/round";
import RpsIsPlayedReducer from "./slices/rpsPlayed";
import ticIsPlayedReducer from "./slices/tictactoePlayed";

const store = configureStore({
  reducer: {
    score: scoreReducer,
    round: roundReducer,
    rps: RpsIsPlayedReducer,
    tictactoe: ticIsPlayedReducer,
  },
});

export default store;
