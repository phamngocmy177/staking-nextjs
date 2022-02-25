import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Layout from "layouts/Layout";
import React from "react";
import LPTokensGrid from "../components/PortfolioComponents/Grids/LPTokensGrid";
import RegularTokensGrid from "../components/PortfolioComponents/Grids/RegularTokensGrid";
import { MOBILE_QUERY } from "../components/utils/responsive";
import { TOKEN_CLASSES } from "../ethereum/constants/tokens";
import { useUserTokens } from "../ethereum/hooks/useUserTokens";

function Portfolio() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const userTokens = useUserTokens();

  const defaultTokens = userTokens[TOKEN_CLASSES.TOKEN];
  const lpTokens = userTokens[TOKEN_CLASSES.LP_TOKEN];

  return (
    <Layout>
      <Container maxWidth="lg">
        <RegularTokensGrid rows={defaultTokens} isMobile={isMobile} />
        <LPTokensGrid rows={lpTokens} isMobile={isMobile} />
      </Container>
    </Layout>
  );
}

export default Portfolio;
