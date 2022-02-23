import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Dehaze";
import classnames from "classnames";
import Link from "next/link";
import { curry, isNil } from "ramda";
import React, { useState } from "react";
import { mapIndexed } from "../../../utils";
import { HEADER_LINKS } from "../constants";

const useStyles = makeStyles((theme) => ({
  contrastText: {
    color: theme.palette.primary.contrastText,
    fontSize: 30,
    fontWeight: 700,
  },
  drawer: {
    backgroundColor: theme.palette.text.primary,
    fontSize: 30,
    fontWeight: 700,
  },
  listItem: {
    paddingLeft: 33,
    paddingBottom: theme.spacing(6.8),
  },
  drawerIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const DrawerMenu = ({ contrastText }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen((isOpen) => !isOpen);

  const createListComponent = curry((listOptions, key) => (
    <Link href={isNil(listOptions.to) ? "" : listOptions.to} passHref>
      <ListItem
        button
        key={key}
        onClick={() => {
          if (listOptions.action) {
            listOptions.action();
          }
        }}
        classes={{ gutters: classes.listItem }}
      >
        <ListItemText
          disableTypography
          primary={listOptions.message}
          classes={{
            root: classnames(classes.contrastText, "header-link-button"),
          }}
        />
      </ListItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <IconButton
        onClick={() => {
          toggleDrawer();
        }}
        className={contrastText ? classes.contrastText : undefined}
        aria-label={"open menu"}
        edge="start"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        classes={{ paper: classes.drawer }}
      >
        <Box
          role="presentation"
          width="100vw"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          paddingBottom={6.8}
          paddingTop={2}
          onClick={toggleDrawer}
          onKeyDown={(event) => {
            if (event.keyCode === 27) {
              toggleDrawer();
            }
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingRight={2}
            paddingLeft={4}
          >
            <Typography variant="body1" className={classes.contrastText}>
              Menu
            </Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleDrawer();
              }}
              className={classes.closeButton}
              aria-label={"close"}
            >
              <CloseIcon className={classes.contrastText} />
            </IconButton>
          </Box>
          <List>{mapIndexed(createListComponent())(HEADER_LINKS)}</List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default DrawerMenu;
