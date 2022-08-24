import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  points: 0,
};

const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    addPoints: (state) => {
      state.points += 10;
    },
    resetPoints: (state) => {
      state.points = 0;
    },
  },
});

export const { addPoints, resetPoints } = pointsSlice.actions;
export const pointsSelector = (state) => state.points;

export default pointsSlice.reducer;
