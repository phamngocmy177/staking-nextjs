import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  infoCard: {
    padding: "1rem",
    borderRadius: "12px",
    width: "100% !important",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: theme.spacing(2, 0),
  },
  subheader: {
    color: theme.palette.text.primary,
    marginTop: "10px",
    fontSize: "12px",
    whiteSpace: "break-spaces",
  },
  circleWrapper: {
    color: theme.palette.text.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  greenCirle: {
    alignItems: "center",
    justifyContent: "center",
    height: "8px",
    width: "8px",
    marginRight: "8px",
    // backgroundColor: theme.palette.successColor[1],
    borderRadius: "50%",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-end",
    },
  },
  optionCardLeft: {
    justifyContent: "center",
    height: "100%",
  },
  headerText: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
  },
  link: {
    width: "100%",
  },
}));

const Option = ({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}) => {
  const classes = useStyles();
  const content = (
    <ButtonBase
      id={id}
      onClick={onClick}
      clickable={clickable && !active}
      active={active}
      className={classes.infoCard}
      component={Paper}
      elevation={5}
    >
      <Box className={classes.optionCardLeft}>
        <Box className={classes.headerText} color={color}>
          {active ? (
            <Box className={classes.circleWrapper}>
              <Box className={classes.greenCirle}></Box>
            </Box>
          ) : (
            ""
          )}
          {header}
        </Box>
        {subheader && <Box className={classes.subheader}>{subheader}</Box>}
      </Box>
      <Box className={classes.iconWrapper}>
        <img
          src={icon}
          alt={"Icon"}
          style={{
            height: size || 24,
            width: size || 24,
          }}
        />
      </Box>
    </ButtonBase>
  );
  if (link) {
    return (
      <Link href={link} target="_blank" className={classes.link}>
        {content}
      </Link>
    );
  }

  return (
    <Grid item xs={12}>
      {content}
    </Grid>
  );
};

export default Option;
