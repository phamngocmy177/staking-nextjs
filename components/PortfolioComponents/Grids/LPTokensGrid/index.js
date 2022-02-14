// @material-ui/core
import { map } from "ramda";
import React from "react";
import { getPlatform, getToken0, getToken1 } from "../../utils";
import LPTokensField from "../Fields/LPTokensField";
import GridBase from "../GridBase";

const columns = [
  {
    field: "tokensData",
    headerName: "Asset",
    flex: 1,
    renderCell: LPTokensField,
  },
  {
    field: "balance",
    headerName: "Balance",
    flex: 1,
    valueFormatter: ({ value }) => parseFloat(value).toFixed(3),
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value),
  },
];
const columnsMobile = [
  {
    field: "tokensData",
    headerName: "Asset",
    flex: 1,
    renderCell: LPTokensField,
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value),
  },
];

function LPTokensGrid({ rows = [], isMobile, ...others }) {
  const parsedRows = map((row) => ({
    ...row,
    tokensData: {
      token0: getToken0(row),
      token1: getToken1(row),
      pool: getPlatform(row),
    },
  }))(rows);

  return (
    <React.Fragment>
      <GridBase
        rows={parsedRows}
        columns={isMobile ? columnsMobile : columns}
        {...others}
        title={"Liquidity Pools"}
      />
    </React.Fragment>
  );
}

export default LPTokensGrid;
