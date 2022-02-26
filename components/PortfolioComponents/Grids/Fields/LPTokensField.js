// @material-ui/core
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const LPTokensField = ({ value }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Avatar className={classes.avatar} src={value.token0.image}></Avatar>
      <Avatar className={classes.avatar} src={value.token1.image}></Avatar>
      {`${value.pool} ${value.token0.symbol} / ${value.token1.symbol}`}
    </Box>
  );
};

export default LPTokensField;
