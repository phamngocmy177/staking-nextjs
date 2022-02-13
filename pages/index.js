import Head from "next/head";
import Layout from "layouts/Layout";
import { useStakingContract } from "../ethereum/hooks/useContract";
import { useTransaction } from "../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../ethereum/hooks/web3";
import { toWei, toPrice } from "../ethereum/utils/unitsHelper";
import InvestBase from "../components/StakingComponents/StakingForm/InvestBase";
import { STAKING_ADDRESS } from "../ethereum/constants/address";
import { programs } from "../ethereum/constants/programs";
import Grid from "@material-ui/core/Grid";

function Staking() {
  const { account, chainId } = useActiveWeb3React();
  const bridgeContract = useStakingContract(STAKING_ADDRESS[chainId]);
  const [sendTransaction, transactionState] = useTransaction(bridgeContract);
  const activePrograms = programs(chainId);

  const onSubmit = async ({ enterAmount }) => {
    const txParams = [
      // roundId,
      // props.depositAsset?.isNative
      //   ? 0
      //   : toWei(
      //       enterAmount.toString(),
      //       props.depositAsset?.decimals
      //     ).toHexString(),
    ];

    // const payableAmount = props.depositAsset?.isNative
    //   ? toWei(enterAmount.toString()).toHexString()
    //   : 0;

    // sendTransaction(
    //   "userDeposit",
    //   txParams,
    //   payableAmount,
    //   account,
    //   `Deposit ${toPrice(
    //     enterAmount,
    //     props.depositAsset?.symbol
    //   )} to ${programTitle}`,
    //   { category: "Catalyst", action: "Submit Invest", label: programTitle }
    // );
  };

  return (
    <Layout>
      <Grid container>
        {activePrograms.map((program) => (
          <Grid item lg={4} key={program.address}>
            <InvestBase
              onSubmit={onSubmit}
              {...program}
              {...transactionState}
              // programTitle={programTitle}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default Staking;
