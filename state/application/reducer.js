import { createReducer } from "@reduxjs/toolkit";
import {
  setCurrentInvestProgram,
  setOpenModal,
  updateBlockNumber,
  updateVersion,
} from "./actions";

const initialState = {
  openModal: null,
  version: 0,
  blockNumber: {},
  popupList: [],
  currentInvestForm: null,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload;
    })
    .addCase(setCurrentInvestProgram, (state, action) => {
      state.currentInvestForm = action.payload;
    })
    .addCase(updateVersion, (state) => {
      state.version = state.version + 1;
    })
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== "number") {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId]
        );
      }
    })
);
