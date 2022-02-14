// @material-ui/core
import { map } from "ramda";
import React from "react";
import { getBalance, getImage, getSymbol, tokenIsETH } from "../../utils";
import TokenField from "../Fields/TokenField";
import GridBase from "../GridBase";

const columns = [
  {
    field: "tokenData",
    headerName: "Asset",
    flex: 1,
    renderCell: TokenField,
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

function RegularTokensGrid({ rows = [], isMobile, ...others }) {
  const parsedRows = map((row) => ({
    ...row,
    tokenData: {
      symbol: getSymbol(row),
      logo: getImage(row),
      balance: getBalance(row),
    },
  }))(rows);

  return (
    <React.Fragment>
      <GridBase
        rows={parsedRows}
        columns={isMobile ? columnsMobile : columns}
        {...others}
        title={"Tokens"}
        isRowSelectable={(params) =>
          !params.row.isStablecoin &&
          (tokenIsETH(params.row) ||
            params.row.existsInUniswap ||
            params.row.existsInSushiswap)
        }
      />
    </React.Fragment>
  );
}

export default RegularTokensGrid;
