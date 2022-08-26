import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  round: 1,
  output: null,
};

const roundSlice = createSlice({
  name: "round",
  initialState,
  reducers: {
    setRound: (state) => {
      state.round += 1;
    },
    resetRound: (state) => {
      state.round = 1;
    },
    outputWin: (state) => {
      state.output = "You Win";
    },
    outputLose: (state) => {
      state.output = "You Lose";
    },
    outputDraw: (state) => {
      state.output = "Draw";
    },
    resetOutput: (state) => {
      state.output = null;
    },
  },
});
export const {
  setRound,
  resetRound,
  outputWin,
  outputLose,
  outputDraw,
  resetOutput,
} = roundSlice.actions;
export const roundSelector = (state) => state.round;
export default roundSlice.reducer;
