import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Layout from "layouts/Layout";
import StakedBalance from "../components/StakingComponents/StakedBalance";
import UniStaking from "../components/StakingComponents/UniStaking";
import { programs } from "../ethereum/constants/programs";
import { useActiveWeb3React } from "../ethereum/hooks/web3";

function Staking() {
  const { chainId } = useActiveWeb3React();

  const activePrograms = programs(chainId);

  return (
    <Layout>
      <Container maxWidth="lg">
        {activePrograms.map((program) => (
          <Grid
            container
            justifyContent="space-between"
            key={program.address}
            spacing={2}
          >
            <Grid item lg={6} sm={6} xs={12}>
              <UniStaking program={program} />
            </Grid>
            <Grid item lg={6} sm={6} xs={12}>
              <StakedBalance program={program} />
            </Grid>
          </Grid>
        ))}
      </Container>
    </Layout>
  );
}

export default Staking;
