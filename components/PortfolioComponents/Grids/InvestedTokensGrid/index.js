import Box from "@material-ui/core/Box";
import { length } from "ramda";
import React from "react";
import InvestmentCardList from "components/InvestmentComponents/InvestmentCardList/InvestmentCardList";
import SectionTitle from "../../SectionTitle";
import InvestmentCard from "./InvestmentCard";
import { useActiveWeb3React } from "../../../../ethereum/hooks/web3";

function InvestedTokensGrid({ rows = [], loading }) {
  const { account } = useActiveWeb3React();

  if (!account) return null;
  return length(rows) ? (
    <React.Fragment>
      <SectionTitle title="My Investments" />
      <InvestmentCardList
        activePrograms={rows}
        loading={loading}
        renderItem={(investedDetails) => (
          <InvestmentCard investedDetails={investedDetails} loading={loading} />
        )}
      />
      <Box marginBottom={2}></Box>
    </React.Fragment>
  ) : null;
}

export default InvestedTokensGrid;
