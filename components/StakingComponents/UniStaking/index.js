import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InvestBase from "../../../components/StakingComponents/StakingForm/InvestBase";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import {
  useTotalStakedBalance,
  useAPR,
} from "../../../ethereum/hooks/useStakedBalance";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { toPrice, toWei } from "../../../ethereum/utils/unitsHelper";
import { BalanceRow } from "../StakedBalance";

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
  const { apr } = useAPR(STAKING_ADDRESS[chainId], program.depositAsset);
  const { loading: totalLoading, totalStakedAsset } = useTotalStakedBalance(
    STAKING_ADDRESS[chainId],
    program.depositAsset
  );

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
      <BalanceRow
        label="TVL"
        loading={totalLoading}
        balance={totalStakedAsset}
        symbol={program.depositAsset.symbol}
      />
      <Typography className={classes.title}>
        APR: {parseFloat(apr * 100).toFixed(2)}%
      </Typography>
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
