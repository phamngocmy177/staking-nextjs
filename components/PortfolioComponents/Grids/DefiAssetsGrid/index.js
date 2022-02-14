// @material-ui/core
import { map } from "ramda";
import React from "react";
import TokenField from "../Fields/TokenField";
import GridBase from "../GridBase";
import { getSymbol, getImage, getBalance } from "../../utils";

const columns = [
  {
    field: "tokenData",
    headerName: "Asset",
    flex: 1,
    renderCell: TokenField,
  },
  {
    field: "protocol",
    headerName: "Platform",
    flex: 1,
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
    field: "tokenData",
    headerName: "Asset",
    flex: 1,
    renderCell: TokenField,
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

function DefiAssetsGrid({ rows = [], isMobile, ...others }) {
  const parsedRows = map((row) => ({
    ...row,
    tokenData: {
      symbol: getSymbol(row),
      logo: getImage(row),
      balance: getBalance(row),
    },
  }))(rows);
  return (
    <GridBase
      rows={parsedRows}
      columns={isMobile ? columnsMobile : columns}
      {...others}
      title={"Defi Assets"}
    />
  );
}

export default DefiAssetsGrid;
