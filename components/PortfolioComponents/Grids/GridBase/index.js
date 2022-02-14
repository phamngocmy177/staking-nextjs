// @material-ui/core
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DataGrid } from "@material-ui/data-grid";
import { map } from "ramda";
import React from "react";
import { useActiveWeb3React } from "../../../../ethereum/hooks/web3";
import SectionTitle from "../../SectionTitle";
import { sumListValues } from "../../utils";

export const GRID_PAGE_SIZE = 3;

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: "20.2749px -8.44789px 59.98px rgba(235, 44, 99, 0.08)",
    border: "0.844789px solid #EFD6DD",
  },
  datagrid: {
    border: "none",
    "&.MuiDataGrid-root .MuiDataGrid-columnSeparator ": {
      display: "none",
    },
  },
  expandButton: {
    marginTop: theme.spacing(1),
    width: 300,
  },
  noRowsContainer: {
    height: "100%",
    width: "100%",
    opacity: 0.2,
  },
  connectWalletButton: {
    position: "absolute",
    top: "65%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  titleButtonWrapper: {
    justifyContent: "flex-end",
  },
  totalTypography: {
    fontSize: "1rem",
    margin: theme.spacing(2, 0, 1, 0),
    fontWeight: "bold",
  },
}));

const NoRowsComponent = () => {
  const classes = useStyles();
  const { account } = useActiveWeb3React();
  if (!account) {
    return (
      <Box className={classes.connectWalletButton}>
        Please connect your wallet
      </Box>
    );
  }
  return <Box className={classes.connectWalletButton}>No Assets</Box>;
};

function GridBase({
  rows = [],
  columns,
  isRapidUnwindingOn,
  title,
  loading,
  TitleButtonComponent,
  ...others
}) {
  const classes = useStyles();
  const total = sumListValues(rows);
  return (
    <React.Fragment>
      <div className={classes.titleContainer}>
        <SectionTitle title={title}></SectionTitle>
        {TitleButtonComponent && (
          <Box display="flex" className={classes.titleButtonWrapper}>
            <TitleButtonComponent />
          </Box>
        )}
      </div>
      <Paper className={classes.paper}>
        <DataGrid
          classes={{
            root: classes.datagrid,
          }}
          rows={rows}
          columns={map((col) => ({ ...col, sortable: false }), columns)}
          checkboxSelection={isRapidUnwindingOn}
          autoHeight
          getRowId={(row) => row.address}
          pageSize={100}
          sortModel={[
            {
              field: "value",
              sort: "desc",
            },
          ]}
          disableColumnMenu
          disableColumnSelector
          disableSelectionOnClick
          hideFooterPagination
          hideFooter
          Footer={<React.Fragment />}
          components={{
            NoRowsOverlay: NoRowsComponent,
          }}
          loading={loading}
          {...others}
        />
        <Typography align="center" className={classes.totalTypography}>
          {total
            ? `Total: ${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }).format(total)}`
            : ""}
        </Typography>
      </Paper>
    </React.Fragment>
  );
}

export default GridBase;
