import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "../../utils/apiFetch";

const initialState = {
  score: null,
};

const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    getScore: (state, action) => {
      state.score = action.payload;
    },
    scoreNull: (state) => {
      state.score = null;
    },
    scoreError: (state, action) => {
      state.score = action.payload;
    },
  },
});

export const { getScore, scoreNull, scoreError } = scoreSlice.actions;
export const scoreSelector = (state) => state.score;
export default scoreSlice.reducer;

const KEY_ACCESS_TOKEN = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(KEY_ACCESS_TOKEN);
}

export function currentScore() {
  return async (dispatch) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      dispatch(scoreNull());
      return;
    }

    try {
      const response = await apiFetch("/api/v1/auth/whoami", {
        headers: new Headers({ Authorization: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(getScore(data.total_score));
      } else {
        dispatch(scoreNull());
      }
    } catch (error) {
      dispatch(scoreError(error));
    }
  };
}
