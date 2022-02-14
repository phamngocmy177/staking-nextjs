import Layout from "layouts/Layout";
import React from "react";
import { useUserTokens } from "../ethereum/hooks/useUserTokens";

function Portfolio() {
  const userTokens = useUserTokens();

  return <Layout></Layout>;
}

export default Portfolio;
