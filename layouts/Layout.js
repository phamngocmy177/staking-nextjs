import AppWrapper from "components/AppComponents/AppWrapper";
import Footer from "components/AppComponents/Footer";
import Header from "components/AppComponents/Header";
import MainWrapper from "components/AppComponents/MainWrapper";
import { useRouter } from "next/router";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import React from "react";

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <AppWrapper>
      <Header />
      <MainWrapper enableBackground={router.pathname === "/"}>
        {children}
      </MainWrapper>
      <Footer />
    </AppWrapper>
  );
}
