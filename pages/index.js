import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "layouts/Layout";
import UniStaking from "../components/StakingComponents/UniStaking";
import StakedBalance from "../components/StakingComponents/StakedBalance";
import { programs } from "../ethereum/constants/programs";
import { useActiveWeb3React } from "../ethereum/hooks/web3";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 0, 0, 0),
  },
}));

function Staking() {
  const classes = useStyles();
  const { chainId } = useActiveWeb3React();

  const activePrograms = programs(chainId);

  return (
    <Layout>
      <Container maxWidth="lg" className={classes.container}>
        {activePrograms.map((program) => (
          <Grid container justifyContent="space-between" key={program.address}>
            <Grid item lg={4}>
              <UniStaking program={program} />
            </Grid>
            <Grid item lg={4}>
              <StakedBalance program={program} />
            </Grid>
          </Grid>
        ))}
      </Container>
    </Layout>
  );
}

export default Staking;
