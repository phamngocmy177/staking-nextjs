import Typography from "@material-ui/core/Typography";
import Skeleton from "react-loading-skeleton";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakedBalance } from "../../../ethereum/hooks/useStakedBalance";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";

function BalanceTypography({ loading, balance }) {
  if (loading) {
    return <Skeleton width={100} height={30} />;
  }
  return <Typography>{balance}</Typography>;
}
function StakedBalance({ program }) {
  const { chainId } = useActiveWeb3React();
  const { stakedBalance, loading } = useStakedBalance(
    STAKING_ADDRESS[chainId],
    program.depositAsset
  );

  return (
    <div>
      <p>Staked Balance: </p>
      <BalanceTypography loading={loading} balance={stakedBalance} />
    </div>
  );
}

export default StakedBalance;
