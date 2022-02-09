import { useWeb3React } from "@web3-react/core";
import AppWrapper from "components/AppComponents/AppWrapper";
import Footer from "components/AppComponents/Footer";
import Header from "components/AppComponents/Header";
import MainWrapper from "components/AppComponents/MainWrapper";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import React from "react";
import { useRouter } from "next/router";
import { NETWORK_CONTEXT_NAME } from "../ethereum/constants/general.js";

export default function Layout({ children }) {
  const { active } = useWeb3React();
  const router = useRouter();
  const contextNetwork = useWeb3React(NETWORK_CONTEXT_NAME);
  return (
    <AppWrapper>
      <Header />
      <MainWrapper enableBackground={router.pathname === "/"}>
        {active || contextNetwork.active ? children : "connecting..."}
      </MainWrapper>
      <Footer />
    </AppWrapper>
  );
}
