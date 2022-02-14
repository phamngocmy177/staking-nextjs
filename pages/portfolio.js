import Layout from "layouts/Layout";
import React from "react";
import { useUserTokens } from "../ethereum/hooks/useUserTokens";
import {
  filterNulls,
  filterByValue,
} from "../components/PortfolioComponents/utils";
import { pipe, groupBy, propOr } from "ramda";
import { TOKEN_CLASSES } from "../ethereum/constants/tokens";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MOBILE_QUERY } from "../components/utils/responsive";
import LPTokensGrid from "../components/PortfolioComponents/Grids/LPTokensGrid";
import RegularTokensGrid from "../components/PortfolioComponents/Grids/RegularTokensGrid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 0, 0, 0),
  },
}));

function Portfolio() {
  const classes = useStyles();

  const userTokens = useUserTokens();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const groupedData = groupBy(propOr(TOKEN_CLASSES.TOKEN, "class"), userTokens);
  const defaultTokens = groupedData[TOKEN_CLASSES.TOKEN];
  const lpTokens = groupedData[TOKEN_CLASSES.LP_TOKEN];

  return (
    <Layout>
      <Container maxWidth="lg" className={classes.container}>
        <RegularTokensGrid rows={defaultTokens} isMobile={isMobile} />
        {/* <LPTokensGrid rows={lpTokens} isMobile={isMobile} /> */}
      </Container>
    </Layout>
  );
}

export default Portfolio;
