import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoading: (state) => {
      state.user = null;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setUserEmpty: (state) => {
      state.user = false;
      state.error = null;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
      state.user = false;
    },
  },
});

export const { setUserLoading, setUserData, setUserEmpty, setUserError } =
  userSlice.actions;

export const userSelector = (state) => state.user;

export default userSlice.reducer;

const KEY_ACCESS_TOKEN = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(KEY_ACCESS_TOKEN);
}

export function getCurrentUser() {
  return async (dispatch) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      dispatch(setUserEmpty());
      return;
    }

    try {
      dispatch(setUserLoading());
      const response = await fetch("http://localhost:4000/api/v1/auth/whoami", {
        headers: new Headers({ Authorization: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUserData(data));
      } else {
        dispatch(setUserEmpty());
      }
    } catch (error) {
      dispatch(setUserError(error));
    }
  };
}

export function login(accessToken) {
  return (dispatch) => {
    localStorage.setItem(KEY_ACCESS_TOKEN, accessToken);
    return dispatch(getCurrentUser());
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    dispatch(setUserEmpty());
  };
}

export function latestData() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    return (dispatch) => {
      return dispatch(getCurrentUser());
    };
  } else {
    return (dispatch) => {
      dispatch(setUserEmpty());
    };
  }
}
