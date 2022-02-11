import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import classnames from "classnames";
import React from "react";
import { MOBILE_QUERY } from "../../utils/responsive";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  roundedDialog: { borderRadius: 30 },
  fixedHeight: {
    [theme.breakpoints.up("md")]: {
      height: 500,
    },
  },
  closeIcon: {
    marginLeft: "auto",
  },
  closeButton: {
    width: "fit-content",
    padding: 0,
  },
  dialogTitle: {
    padding: theme.spacing(2, 3),
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    position: "relative",
    alignItems: "center",
  },
  dialogContentNoPadding: {
    padding: 0,
  },
  dialogContentRoudedPadding: {
    padding: theme.spacing(0, 3, 3, 3),
  },
  goBackButton: {
    marginRight: "auto",
    paddding: theme.spacing(1.5),
  },
  titleTypography: {
    fontSize: 18,
    fontWeight: "bold",
  },
}));

const ContentWrapper = ({ withContent, contentClass, children }) =>
  withContent ? (
    <DialogContent
      classes={{
        root: contentClass,
      }}
    >
      {children}
    </DialogContent>
  ) : (
    children
  );

const ResponsiveDialog = ({
  handleClose,
  open,
  children,
  DialogActionsComponent,
  dialogContentClass,
  fixedHeight = true,
  noPadding,
  disableFullScreen = false,
  closeButton,
  goBackButton,
  onGoBackClick,
  onClick,
  hideBackdrop,
  maxWidth = "lg",
  title,
  disableContent,
}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <Dialog
      hideBackdrop={hideBackdrop}
      onClick={onClick}
      open={!!open}
      onClose={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      scroll="paper"
      classes={{
        paper: classnames(
          classes.root,
          fixedHeight ? classes.fixedHeight : undefined,
          !isMobile || disableFullScreen ? classes.roundedDialog : undefined
        ),
      }}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={disableFullScreen ? null : isMobile}
    >
      {(closeButton || goBackButton) && (
        <DialogTitle className={classes.dialogTitle} disableTypography>
          {closeButton && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className={classes.closeButton}
              aria-label={"close"}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          )}
          {title && (
            <Typography variant="body1" className={classes.titleTypography}>
              {title}
            </Typography>
          )}
          {goBackButton && (
            <Button onClick={onGoBackClick} className={classes.goBackButton}>
              {"back"}
            </Button>
          )}
        </DialogTitle>
      )}
      <ContentWrapper
        withContent={!disableContent}
        contentClass={classnames(
          noPadding
            ? classes.dialogContentNoPadding
            : classes.dialogContentRoudedPadding,
          dialogContentClass
        )}
      >
        {children}
      </ContentWrapper>
      {DialogActionsComponent}
    </Dialog>
  );
};

export default ResponsiveDialog;
