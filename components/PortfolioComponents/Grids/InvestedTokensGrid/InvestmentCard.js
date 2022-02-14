import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LightPinkBg from "assets/img/bg/light-pink-bg.svg";
import MaskBg from "assets/img/bg/mask.svg";
import { blackColor } from "assets/jss/nextjs-material-dashboard-pro.js";
import classNames from "classnames";
import KeytangoButton from "components/KeytangoComponents/KeytangoButton";
import KeytangoCardFlip from "components/KeytangoComponents/KeytangoCardFlip";
import Image from "next/image";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isProgramClaimable } from "../../utils";
import ClaimCard from "./ClaimCard";

const CARD_HEIGHT = 450;

const useStyles = makeStyles((theme) => ({
  container: {
    height: CARD_HEIGHT,
  },
  card: {
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.border.primary,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    boxShadow: "24px -10px 71px -28px rgba(235, 44, 99, 0.12)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
    height: "100%",
  },
  pinkBackground: {
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundImage: `url(${MaskBg}), url(${LightPinkBg})`,
    backgroundSize: "auto auto, auto 230px",
    backgroundPositionX: "center, left",
    backgroundPositionY: "center, center",
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontSize: 19,
    fontWeight: 400,
    marginTop: theme.spacing(2),
    marginBottom: 0,
    textAlign: "center",
  },
  apy: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  whiteTypography: {
    color: `${theme.palette.common.white} !important`,
  },
  lock: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  },
  lockTime: {
    fontSize: 18,
    fontWeight: 700,
    marginLeft: theme.spacing(2),
  },
  learnMore: {
    margin: theme.spacing(2, 0, 4, 0),
    color: blackColor,
    fontSize: 18,
    fontWeight: 400,
    textDecoration: "underline",
    textAlign: "center",
  },
  cardFlip: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  claimButton: {
    width: theme.spacing(31),
  },
  whiteButton: {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
}));

function InvestmentCard({ investedDetails, loading }) {
  const classes = useStyles();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClaimButtonClick = () => {
    setIsFlipped(true);
  };
  const handleCancelButtonClick = () => {
    setIsFlipped(false);
  };

  const program = investedDetails?.program;

  const isClaimable = loading ? false : isProgramClaimable(program);

  return (
    <React.Fragment>
      <Box className={classes.container}>
        <KeytangoCardFlip
          isFlipped={isFlipped}
          FrontComponent={
            <Card
              className={classNames(classes.card, {
                [classes.pinkBackground]: isClaimable,
              })}
            >
              <Box className={classes.cardFlip}>
                {loading ? (
                  <Skeleton style={{ height: 55, width: 55 }} />
                ) : (
                  <Image
                    src={program?.icon}
                    width={55}
                    height={55}
                    objectFit="contain"
                    alt="token"
                  />
                )}
                <Typography className={classes.title}>
                  {loading ? (
                    <Skeleton style={{ height: 10, width: 200 }} />
                  ) : (
                    <React.Fragment>
                      {program?.programTitle}{" "}
                      {program?.roundId && `- Round ${program?.roundId}`}
                    </React.Fragment>
                  )}
                </Typography>
                <Typography
                  className={classNames(classes.apy, {
                    [classes.whiteTypography]: isClaimable,
                  })}
                >
                  {loading ? (
                    <Skeleton style={{ height: 20, width: 170 }} />
                  ) : (
                    <React.Fragment>
                      APY: {parseInt(program?.apy)}%
                    </React.Fragment>
                  )}
                </Typography>
                <KeytangoButton
                  label="Claim"
                  onClick={handleClaimButtonClick}
                  disableWrapper
                  fullWidth={false}
                  className={classNames(classes.claimButton, {
                    [classes.whiteButton]: isClaimable,
                  })}
                  disabled={loading}
                />
              </Box>
            </Card>
          }
          BackComponent={
            loading ? (
              <React.Fragment />
            ) : (
              <Card className={classes.card}>
                <Box className={classes.cardFlip}>
                  <ClaimCard
                    label="Claim"
                    fullWidth={false}
                    disableWrapper
                    program={program}
                    className={classes.claimButton}
                  />
                  <KeytangoButton
                    variant="text"
                    label="Cancel"
                    onClick={handleCancelButtonClick}
                  />
                </Box>
              </Card>
            )
          }
        />
      </Box>
    </React.Fragment>
  );
}

export default InvestmentCard;
