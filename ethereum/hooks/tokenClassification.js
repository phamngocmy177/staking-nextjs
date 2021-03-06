import { pathEq, pathSatisfies, includes, toLower, map } from "ramda";
import { LP_TOKEN_PLATFORM } from "../constants/tokens";

const tokenNamePath = ["tokenInfo", "name"];
const addressPath = ["address"];

export const isUniswapv2LP = pathEq(
  tokenNamePath,
  LP_TOKEN_PLATFORM.UNISWAP_V2
);
export const isUniswapv3LP = pathEq(
  tokenNamePath,
  LP_TOKEN_PLATFORM.UNISWAP_V3
);
export const isSushiswapLP = pathEq(tokenNamePath, LP_TOKEN_PLATFORM.SUSHISWAP);

export const isCToken = pathSatisfies(
  (address) =>
    includes(toLower(address), map(toLower, protocolAddresses["Compound"])),
  addressPath
);

export const isAToken = pathSatisfies(
  (address) =>
    includes(toLower(address), map(toLower, protocolAddresses["Aave V2"])),
  addressPath
);

export const isYDAIv3Token = pathSatisfies(
  (address) =>
    includes(
      toLower(address),
      map(toLower, protocolAddresses["iearn.finance (v3)"])
    ),
  addressPath
);
export const isStablecoin = pathSatisfies(
  (address) =>
    includes(toLower(address), map(toLower, protocolAddresses["Stables"])),
  addressPath
);

const protocolAddresses = {
  Stables: [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
    "0x0000000000085d4780b73119b644ae5ecd22b376",
    "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    "0xdF574c24545E5FfEcb9a659c229253D4111d87e1",
  ],
  "Aave V2": [
    "0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2",
    "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
    "0x39C6b3e42d6A679d7D776778Fe880BC9487C2EDA",
    "0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656",
    "0x05Ec93c0365baAeAbF7AefFb0972ea7ECdD39CF1",
    "0x101cc05f4A51C0319f570d5E146a8C625198e636",
    "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
    "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
    "0x6C5024Cd4F8A59110119C56f8933403A539555EB",
    "0xBcca60bB61934080951369a648Fb03DF4F96263C",
    "0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0",
    "0x5165d24277cD063F5ac44Efd447B27025e888f37",
    "0xA361718326c15715591c299427c62086F69923D9",
    "0xc713e5E149D5D0715DcD1c156a020976e7E56B88",
    "0xa685a61171bb30d4072B338c80Cb7b2c865c873E",
    "0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1",
    "0xDf7FF54aAcAcbFf42dfe29DD6144A69b629f8C9e",
    "0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B",
    "0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef",
    "0xCC12AbE4ff81c9378D670De1b57F8e0Dd228D77a",
    "0xD37EE7e4f452C6638c96536e68090De8cBcdb583",
    "0x272F97b7a56a387aE942350bBC7Df5700f8a4576",
    "0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1",
    "0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a",
  ],
  SushiSwap: [
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0",
    "0x06da0fd433C1A5d7a4faa01111c044910A184553",
    "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
    "0xF1F85b2C54a2bD284B1cf4141D64fD171Bd85539",
    "0x001b6450083E531A5a7Bf310BD2c1Af4247E23D4",
    "0xA75F7c2F025f470355515482BdE9EFA8153536A8",
    "0xC40D16476380e4037e6b1A2594cAF6a6cc8Da967",
    "0xCb2286d9471cc185281c4f763d34A962ED212962",
    "0x31503dcb60119A812feE820bb7042752019F2355",
    "0x5E63360E891BD60C69445970256C260b0A6A54c6",
    "0xA1d7b2d891e3A1f9ef4bBC5be20630C2FEB1c470",
    "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C",
    "0x611CDe65deA90918c0078ac0400A72B0D25B9bb1",
    "0xaAD22f5543FCDaA694B68f94Be177B561836AE57",
    "0x117d4288B3635021a3D612FE05a3Cbf5C717fEf2",
    "0x95b54C8Da12BB23F7A5F6E26C38D04aCC6F81820",
    "0x58Dc5a51fE44589BEb22E8CE67720B5BC5378009",
  ],
  "Uniswap V2": [
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
  ],
  Curve: [
    "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
    "0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23",
    "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
    "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
    "0xC25a3A3b969415c80451098fa907EC722572917F",
    "0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8",
    "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    "0x49849C98ae39Fff122806C06791Fa73784FB3675",
    "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
    "0xb19059ebb43466C323583928285a49f558E572Fd",
    "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
    "0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858",
    "0x97E2768e8E73511cA874545DC5Ff8067eB19B787",
    "0x4f3E8F405CF5aFC05D68142F3783bDfE13811522",
    "0x6D65b498cb23deAba52db31c93Da9BFFb340FB8F",
    "0x1AEf73d49Dedc4b1778d0706583995958Dc862e6",
    "0xC2Ee6b0334C261ED60C72f6054450b61B8f18E35",
    "0x64eda51d3Ad40D56b9dFc5554E06F94e1Dd786Fd",
    "0x3a664Ab939FD8482048609f652f9a0B0677337B9",
    "0x06325440D014e39736583c165C2963BA99fAf14E",
    "0xFd2a8fA60Abd58Efe3EeE34dd494cD491dC14900",
    "0xA3D87FffcE63B53E0d54fAa1cc983B7eB0b74A9c",
    "0x194eBd173F6cDacE046C53eACcE9B953F28411d1",
    "0x94e131324b6054c0D789b190b2dAC504e4361b53",
    "0x2fE94ea3d5d4a175184081439753DE15AeF9d614",
    "0x410e3E86ef427e30B9235497143881f717d93c2A",
    "0xDE5331AC4B3630f94853Ff322B66407e0D6331E8",
  ],
  Compound: [
    "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
    "0xc00e94cb662c3520282e6f5717214004a7f26888",
    "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
    "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
    "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407",
    "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
    "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4",
    "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4",
  ],
  "iearn.finance (v3)": [
    "0xC2cB1040220768554cf699b0d863A3cd4324ce32",
    "0x26EA744E5B887E5205727f55dFBE8685e3b21951",
    "0xE6354ed5bC4b393a5Aad09f21c46E101e692d447",
    "0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE",
  ],
  "iearn.finance (v2)": [
    "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    "0xd6aD7a6750A7593E092a9B218d66C0A814a3436e",
    "0x83f798e925BcD4017Eb265844FDDAbb448f1707D",
    "0xF61718057901F84C4eEC4339EF8f0D86D2B45600",
    "0x73a052500105205d34Daf004eAb301916DA8190f",
    "0x04Aa51bbcB46541455cCF1B8bef2ebc5d3787EC9",
  ],
};
