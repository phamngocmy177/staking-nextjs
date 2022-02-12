import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "assets/images/logo.png";
import classnames from "classnames";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HEADER_LINKS } from "../constants";
import HeaderLinksSection from "./HeaderLinksSection";
import TransactionsCenter from "../../../Web3Components/TransactionsCenter";
import Web3StatusButton from "../../../Web3Components/Web3StatusButton";
import { useDarkModeManager } from "state/user/hooks";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "none",
    backgroundColor: theme.colors.bg0,
  },
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  logoLink: {
    zIndex: 1,
    display: "flex",
  },
}));

const Header = () => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [darkMode, toggleSetDarkMode] = useDarkModeManager();

  return (
    <AppBar
      position="static"
      classes={{ root: classes.root }}
      color="transparent"
    >
      <Toolbar classes={{ root: classnames(classes.root, classes.toolbar) }}>
        <Link href={"/"} passHref>
          <Box style={{ cursor: "pointer" }}>
            <Image
              src={logo}
              alt="logo"
              height={100}
              width={"100%"}
              objectFit="contain"
            />
          </Box>
        </Link>
        <HeaderLinksSection headerLinks={HEADER_LINKS} />
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
