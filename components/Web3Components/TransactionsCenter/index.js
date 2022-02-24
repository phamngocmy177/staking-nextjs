import Badge from "@material-ui/core/Badge";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { mapIndexed } from "components/utils";
import { useActiveWeb3React } from "ethereum/hooks/web3";
import { curry, length } from "ramda";
import React, { useMemo, useState } from "react";
import {
  isTransactionRecent,
  useAllTransactions,
} from "state/transactions/hooks";
import Transaction from "./Transaction";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  managerClasses: {
    [theme.breakpoints.up("md")]: {
      display: "inline-block",
    },
  },
  circularProgress: {
    color: "white",
    background: "transparent !important",
    marginRight: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: "#4C4C66",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    padding: theme.spacing(3, 3, 0, 3),
  },
  popover: {
    padding: theme.spacing(0),
    maxHeight: 500,
    overflowX: "auto",
  },
  menuItem: {
    padding: theme.spacing(3),
  },
}));

function newTransactionsFirst(a, b) {
  return b.addedTime - a.addedTime;
}

const createTransactionItem = curry((classes, chainId, hash, key) => (
  <MenuItem key={key} className={classes.menuItem}>
    <Transaction hash={hash} chainId={chainId}></Transaction>
  </MenuItem>
));

export default function TransactionsCenter() {
  const classes = useStyles();
  const allTransactions = useAllTransactions();
  const { chainId } = useActiveWeb3React();
  const [openNotification, setOpenNotification] = useState(null);
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);

  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  return (
    <Box>
      {length(pending) ? (
        <Chip
          color="primary"
          avatar={
            <CircularProgress size={16} className={classes.circularProgress} />
          }
          size="medium"
          label={`${length(pending)} pending`}
        ></Chip>
      ) : null}
      <IconButton
        aria-label="Notifications"
        aria-owns={openNotification ? "notification-menu-list" : null}
        aria-haspopup="true"
        onClick={handleClickNotification}
        className={classes.icon}
      >
        <Badge badgeContent={length(pending) + length(confirmed)} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      <Popper
        open={Boolean(openNotification)}
        anchorEl={openNotification}
        transition
        disablePortal
        placement="bottom"
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            id="notification-menu-list"
            style={{ transformOrigin: "0 0 0" }}
            className={classes.popover}
          >
            <Paper className={classes.dropdown}>
              <Typography className={classes.title}>Notifications</Typography>
              <ClickAwayListener onClickAway={handleCloseNotification}>
                <MenuList role="menu">
                  {length(confirmed) + length(pending) ? (
                    <Box>
                      {mapIndexed(createTransactionItem(classes, chainId))(
                        pending
                      )}
                      {mapIndexed(createTransactionItem(classes, chainId))(
                        confirmed
                      )}
                    </Box>
                  ) : (
                    <MenuItem disabled>
                      <Box width={300} padding={3}>
                        No Notifications
                      </Box>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
