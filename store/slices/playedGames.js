import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rpsPlayed: false,
  games: [],
};

const rpsSlice = createSlice({
  name: "played",
  initialState,
  reducers: {
    addPlayedGames: (state, action) => {
      state.games.push({
        title: action.payload,
      });
    },
    resetPlayedGames: (state) => {
      state.games = [];
    },
  },
});

export const { addPlayedGames } = rpsSlice.actions;
export const rpsSelector = (state) => state.played;

export default rpsSlice.reducer;
