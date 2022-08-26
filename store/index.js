import { configureStore } from "@reduxjs/toolkit";
import roundReducer from "./slices/round";
import playedGames from "./slices/playedGames";
import pointsReducer from "./slices/points";

const store = configureStore({
  reducer: {
    round: roundReducer,
    played: playedGames,
    points: pointsReducer,
  },
});

export default store;
