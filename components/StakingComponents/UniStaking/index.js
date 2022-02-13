import InvestBase from "../../../components/StakingComponents/StakingForm/InvestBase";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { toPrice, toWei } from "../../../ethereum/utils/unitsHelper";

function UniStaking({ program, ...others }) {
  const { account, chainId } = useActiveWeb3React();
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
    <InvestBase
      onSubmit={onSubmit}
      {...program}
      {...transactionState}
      {...others}
      programTitle={program.title}
    />
  );
}

export default UniStaking;
