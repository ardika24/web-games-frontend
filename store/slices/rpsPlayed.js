import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rpsPlayed: false,
};

const rpsSlice = createSlice({
  name: "rps",
  initialState,
  reducers: {
    playedTrue: (state) => {
      state.rpsPlayed = true;
    },
    playedFalse: (state) => {
      state.rpsPlayed = false;
    },
  },
});

export const { playedTrue, playedFalse } = rpsSlice.actions;
export const rpsSelector = (state) => state.rps;

export default rpsSlice.reducer;
