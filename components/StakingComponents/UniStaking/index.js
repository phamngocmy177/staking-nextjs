import InvestBase from "../../../components/StakingComponents/StakingForm/InvestBase";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { toPrice, toWei } from "../../../ethereum/utils/unitsHelper";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "0.5px solid grey",
    borderRadius: 20,
    padding: 20,
    height: "100%",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      height: "initial",
      marginBottom: theme.spacing(4),
    },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text1,
  },
}));
function UniStaking({ program, ...others }) {
  const { account, chainId } = useActiveWeb3React();
  const classes = useStyles();

  const stakingContract = useStakingContract(STAKING_ADDRESS[chainId]);
  const [sendTransaction, transactionState] = useTransaction(stakingContract);

  const onSubmit = async ({ enterAmount }) => {
    const txParams = [
      toWei(
        enterAmount.toString(),
        program.depositAsset?.decimals
      ).toHexString(),
    ];

    const payableAmount = 0;

    sendTransaction(
      "stake",
      txParams,
      payableAmount,
      account,
      `Deposit ${toPrice(enterAmount, program.depositAsset?.symbol)} to ${
        program.title
      }`
    );
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>{program.title}</Typography>
      <InvestBase
        onSubmit={onSubmit}
        {...program}
        {...transactionState}
        {...others}
        programTitle={program.title}
      />
    </Box>
  );
}

export default UniStaking;
