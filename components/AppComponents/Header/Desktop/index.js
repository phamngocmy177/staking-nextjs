import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import classnames from "classnames";
import React from "react";
import { useDarkModeManager } from "state/user/hooks";
import TransactionsCenter from "../../../Web3Components/TransactionsCenter";
import Web3StatusButton from "../../../Web3Components/Web3StatusButton";
import { HEADER_LINKS } from "../constants";
import HeaderLinksSection from "./HeaderLinksSection";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "none",
    backgroundColor: theme.colors.headerBg,
  },
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    boxShadow: `0px 4px 34px -12px ${theme.colors.headerShadow}`,
  },
  logoLink: {
    zIndex: 1,
    display: "flex",
  },
}));

const Header = () => {
  const classes = useStyles();
  const [darkMode, toggleSetDarkMode] = useDarkModeManager();

  return (
    <AppBar
      position="static"
      classes={{ root: classes.root }}
      color="transparent"
    >
      <Toolbar classes={{ root: classnames(classes.root, classes.toolbar) }}>
        <Box display="flex" alignItems="center">
          <HeaderLinksSection headerLinks={HEADER_LINKS} />
        </Box>

        <Box display="flex" alignItems="center">
          <TransactionsCenter />
          <Web3StatusButton />
          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleSetDarkMode}
            color="inherit"
          >
            {darkMode ? (
              <Brightness7Icon style={{ fill: "white" }} />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
