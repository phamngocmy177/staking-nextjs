import { createAction } from "@reduxjs/toolkit";

export const APPLICATION_MODALS = {
  WALLET: "WALLET",
  RAPID_UNWIND: "RAPID_UNWIND",
  RAPID_UNWIND_LP: "RAPID_UNWIND_LP",
  INVEST: "INVEST",
  TRANSACTION: "TRANSACTION",
  RE_INVEST: "RE_INVEST",
};

export const setCurrentInvestProgram = createAction(
  "application/setCurrentInvestProgram"
);
export const setOpenModal = createAction("application/setOpenModal");
export const updateVersion = createAction("application/updateVersion");
export const updateBlockNumber = createAction("application/updateBlockNumber");
