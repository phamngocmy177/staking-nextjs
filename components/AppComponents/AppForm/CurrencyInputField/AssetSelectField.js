import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import classnames from "classnames";
import { isNil, length } from "ramda";
import React, { useState } from "react";
import ResponsiveDialog from "../../ResponsiveDialog";
import { mapIndexed } from "../../../utils";
import { useTokenBalance } from "../../../../ethereum/hooks/useBalances";
import Skeleton from "react-loading-skeleton";

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  pointer: {
    cursor: "pointer",
  },
  assetTypography: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
}));

const AssetBalance = ({ asset }) => {
  const tokenBalance = useTokenBalance(asset);
  return (
    <ListItemSecondaryAction>
      <Typography>
        {isNil(tokenBalance) ? (
          <Skeleton width={100}></Skeleton>
        ) : (
          new Intl.NumberFormat("en-US", {
            maximumFractionDigits: asset.maximumFractionDigits,
          }).format(tokenBalance)
        )}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Balance
      </Typography>
    </ListItemSecondaryAction>
  );
};

const AssetItem = ({ asset, onClick, AssetBalanceComponent }) => (
  <ListItem onClick={onClick} button>
    <ListItemAvatar>
      <Avatar src={asset.smallIcon || asset.image} alt={asset?.name} />
    </ListItemAvatar>
    <ListItemText primary={asset.symbol} secondary={asset?.name} />
    {AssetBalanceComponent ? (
      React.cloneElement(AssetBalanceComponent, { asset })
    ) : (
      <AssetBalance asset={asset} />
    )}
  </ListItem>
);

export const AssetSelectField = ({
  depositAssets,
  selectedAsset,
  onChange,
  labelTypographtClass,
  containerClass,
  AssetBalanceComponent,
  AssetSelectComponent,
  ...others
}) => {
  const classes = useStyles();
  const hasMultipleDepositAssets = length(depositAssets) > 1;
  const [dialogOpen, setDialogOpen] = useState(null);

  const handleClickListItem = () => {
    setDialogOpen(true);
  };

  const handleMenuItemClick = (asset) => {
    onChange(asset);
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        onClick={
          hasMultipleDepositAssets || AssetSelectComponent
            ? handleClickListItem
            : undefined
        }
        className={classnames(
          containerClass,
          hasMultipleDepositAssets || AssetSelectComponent
            ? classes.pointer
            : undefined
        )}
        {...others}
      >
        {AssetSelectComponent || (
          <React.Fragment>
            <Typography
              className={classnames(
                classes.assetTypography,
                labelTypographtClass
              )}
            >
              <Avatar
                className={classes.avatar}
                src={selectedAsset.smallIcon || selectedAsset.image}
                alt={selectedAsset?.symbol}
              ></Avatar>
              {length(selectedAsset.symbol) === 3
                ? `${selectedAsset.symbol} `
                : selectedAsset.symbol}
            </Typography>
            {hasMultipleDepositAssets && <ArrowDropDownIcon />}
          </React.Fragment>
        )}
      </Box>
      <ResponsiveDialog
        closeButton
        open={dialogOpen}
        handleClose={handleClose}
        disableFullScreen
        title="Select token"
        maxWidth="xs"
        noPadding
        fixedHeight={false}
      >
        <List>
          {mapIndexed(
            (asset, index) => (
              <AssetItem
                key={index}
                asset={asset}
                onClick={() => handleMenuItemClick(asset)}
                AssetBalanceComponent={AssetBalanceComponent}
              />
            ),
            depositAssets
          )}
        </List>
      </ResponsiveDialog>
    </React.Fragment>
  );
};

export default AssetSelectField;
