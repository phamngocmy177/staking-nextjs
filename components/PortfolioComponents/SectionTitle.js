import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import classnames from "classnames";

const useStyles = makeStyles((theme) => ({
  titleTypography: {
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
    fontWeight: "bold",
    textTransform: "uppercase",
    color: theme.palette.primary.main,
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
}));

const SectionTitle = ({ title, gutterBottom = true, ...others }) => {
  const classes = useStyles();

  return (
    <Typography
      tabIndex="0"
      className={classnames(
        classes.titleTypography,
        gutterBottom ? classes.gutterBottom : undefined
      )}
      variant="h2"
      {...others}
    >
      {`${title} `}
    </Typography>
  );
};

export default SectionTitle;
