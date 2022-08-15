import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ticPlayed: false,
};

const tictactoeSlice = createSlice({
  name: "tictactoe",
  initialState,
  reducers: {
    playedTrue: (state) => {
      state.ticPlayed = true;
    },
    playedFalse: (state) => {
      state.ticPlayed = false;
    },
  },
});

export const { playedTrue, playedFalse } = tictactoeSlice.actions;
export const tictactoeSelector = (state) => state.tictactoe;

export default tictactoeSlice.reducer;
