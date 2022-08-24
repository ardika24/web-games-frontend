import { configureStore } from "@reduxjs/toolkit";
import scoreReducer from "./slices/score";
import roundReducer from "./slices/round";
import RpsIsPlayedReducer from "./slices/rpsPlayed";
import ticIsPlayedReducer from "./slices/tictactoePlayed";
import pointsReducer from "./slices/points";

const store = configureStore({
  reducer: {
    score: scoreReducer,
    round: roundReducer,
    rps: RpsIsPlayedReducer,
    tictactoe: ticIsPlayedReducer,
    points: pointsReducer,
  },
});

export default store;
