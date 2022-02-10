import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import { SnackbarContent, useSnackbar as useDefaultSnackbar } from "notistack";
import { forwardRef } from "react";

const iconStyle = {
  fontSize: "22px",
  marginRight: "10px",
  verticalAlign: "middle",
};

function SuccessIcon(props) {
  const { color } = props;
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM10.75,16.518,6.25,12.2l1.4-1.435L10.724,13.7l6.105-6.218L18.25,8.892Z"
      />
    </SvgIcon>
  );
}

function ErrorIcon(props) {
  const { color } = props;
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M16.971,0H7.029L0,7.029V16.97L7.029,24H16.97L24,16.971V7.029L16.971,0Zm-1.4,16.945-3.554-3.521L8.5,16.992,7.079,15.574l3.507-3.566L7,8.536,8.418,7.119,12,10.577l3.539-3.583,1.431,1.431-3.535,3.568L17,15.515Z"
      />
    </SvgIcon>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  card: {
    width: "100%",
  },
  typography: {
    fontWeight: "bold",
  },
}));

// eslint-disable-next-line react/display-name
const SnackMessage = forwardRef((props, ref) => {
  const classes = useStyles();

  let icon;
  let color;
  let messageType;

  switch (props.variant) {
    case "error":
      icon = <ErrorIcon color={"red"} />;
      color = "red";
      messageType = "Error";
      break;
    case "success":
      icon = <SuccessIcon color={"green"} />;
      color = "green";
      messageType = "Success";
      break;

    default:
      icon = <SuccessIcon color={"green"} />;
      color = "green";
      messageType = "Success";
      break;
  }

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Paper className={classes.card}>
        <div
          style={{
            padding: "12px",
            borderLeft: `5px solid ${color}`,
            borderRadius: "4px",
          }}
        >
          {icon}
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              maxWidth: "400px",
            }}
          >
            <Typography
              variant="body1"
              style={{ fontSize: "18px", color: color }}
            >
              {messageType}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "16px" }}>
              {props.message}
            </Typography>
          </div>
        </div>
      </Paper>
    </SnackbarContent>
  );
});

const useEnqueueSnackbar = () => {
  const { enqueueSnackbar } = useDefaultSnackbar();

  const pushSnackbar = (message, options) => {
    enqueueSnackbar(message, {
      ...options,
      content: (key) => {
        const { variant } = options || { variant: undefined };
        return <SnackMessage id={key} message={message} variant={variant} />;
      },
    });
  };

  return pushSnackbar;
};

export default useEnqueueSnackbar;
