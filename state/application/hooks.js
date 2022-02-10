import { useCallback, useMemo } from "react";
import { setOpenModal, APPLICATION_MODALS, updateVersion } from "./actions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useActiveWeb3React } from "../../ethereum/hooks/web3";

export function useModalOpen(modal) {
  const openModal = useAppSelector((state) => state.application.openModal);
  return openModal === modal;
}

export function useVersion() {
  const version = useAppSelector((state) => state.application.version);
  return version;
}

export function useToggleModal(modal) {
  const open = useModalOpen(modal);
  const dispatch = useAppDispatch();
  return useCallback(
    () => dispatch(setOpenModal(open ? null : modal)),
    [dispatch, modal, open]
  );
}

export function useOpenModal(modal) {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useUpdateVersion() {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(updateVersion()), [dispatch]);
}

export function useCloseModals() {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch]);
}

export function useWalletModalToggle() {
  return useToggleModal(APPLICATION_MODALS.WALLET);
}

export function useRapidUnwindModalToggle() {
  return useToggleModal(APPLICATION_MODALS.RAPID_UNWIND);
}

export function useRapidUnwindLPModalToggle() {
  return useToggleModal(APPLICATION_MODALS.RAPID_UNWIND_LP);
}

export function useBlockNumber() {
  const { chainId } = useActiveWeb3React();

  return useAppSelector(
    (state) => state.application.blockNumber[chainId ?? -1]
  );
}

// get the list of active popups
export function useActivePopups() {
  const list = useAppSelector((state) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
