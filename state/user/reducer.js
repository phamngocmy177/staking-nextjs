import { createReducer } from "@reduxjs/toolkit";
import { updateMatchesDarkMode, updateUserDarkMode } from "./actions";

const currentTimestamp = () => new Date().getTime();

export const initialState = {
  matchesDarkMode: false,
  userDarkMode: null,
  timestamp: currentTimestamp(),
};

export default createReducer(initialState, (builder) =>
  builder

    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode;
      state.timestamp = currentTimestamp();
    })
);
