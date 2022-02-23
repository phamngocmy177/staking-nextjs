import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Web3StatusButton from "../../../Web3Components/Web3StatusButton";
import DrawerMenu from "./DrawerMenu";
import TransactionsCenter from "../../../Web3Components/TransactionsCenter";
import { useDarkModeManager } from "state/user/hooks";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import IconButton from "@material-ui/core/IconButton";

const styles = (theme) => ({
  appBar: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.colors.headerBg,
  },
  toolbar: {
    justifyContent: "flex-end",
    height: 66,
    minHeight: 66,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  boxShadow: {
    boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
  },
  noShadow: {
    boxShadow: "none",
  },
  backdrop: { zIndex: theme.zIndex.appBar - 2 },

  absoluteCenter: {
    top: "50%",
    right: "50%",
    position: "absolute",
    transform: "translate(50%, -50%)",
  },
  logo: {},
});

const Header = ({
  classes,
  handleLogout,
  unseenRecommendationsCount,
  photoURL,
  isLoggedIn,
  userName,
  handleToggleTheme,
  themeType,
}) => {
  const [darkMode, toggleSetDarkMode] = useDarkModeManager();
  return (
    <AppBar
      position="sticky"
      className={classnames(classes.appBar, classes.noShadow)}
    >
      <Toolbar className={classes.toolbar} variant="dense">
        <TransactionsCenter />
        <IconButton sx={{ ml: 1 }} onClick={toggleSetDarkMode} color="inherit">
          {darkMode ? (
            <Brightness7Icon style={{ fill: "white" }} />
          ) : (
            <Brightness4Icon style={{ fill: "black" }} />
          )}
        </IconButton>
        <Box display="flex">
          <Web3StatusButton />
          <DrawerMenu
            photoURL={photoURL}
            isLoggedIn={isLoggedIn}
            userName={userName}
            handleLogout={handleLogout}
            unseenRecommendationsCount={unseenRecommendationsCount}
            handleToggleTheme={handleToggleTheme}
            themeType={themeType}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
