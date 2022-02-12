/* eslint-disable no-unused-vars */
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import wrapper from "state";
import { getLibrary } from "ethereum/utils";
import { useTheme } from "../theme";

// const PageChange = dynamic(
//   () => import("components/DashboardComponents/PageChange/PageChange.js"),
//   {
//     ssr: false,
//   }
// );
const Web3ReactManager = dynamic(
  () => import("components/Web3Components/Web3ReactManager"),
  {
    ssr: false,
  }
);
const ApplicationUpdater = dynamic(() => import("state/application/updater"), {
  ssr: false,
});
const MulticallUpdater = dynamic(() => import("state/multicall/updater"), {
  ssr: false,
});
const TransactionUpdater = dynamic(() => import("state/transactions/updater"), {
  ssr: false,
});
const UserUpdater = dynamic(() => import("state/user/updater"), {
  ssr: false,
});
const Web3ProviderNetwork = dynamic(
  () => import("../components/Web3Components/Web3ReactProviderDefaultSSR"),
  { ssr: false }
);

const PageChange = () => <div></div>;

Router.events.on("routeChangeStart", (url) => {
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

function Updaters() {
  return (
    <>
      <TransactionUpdater />
      <ApplicationUpdater />
      <MulticallUpdater />
      <UserUpdater />
    </>
  );
}

const MyApp = ({ Component, pageProps }) => {
  const store = useStore((state) => state);
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>keyTango</title>
      </Head>
      <PersistGate persistor={store.__persistor} loading={<PageChange />}>
        <ThemeProvider theme={theme}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <SnackbarProvider
                hideIconVariant
                maxSnack={5}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                autoHideDuration={10000}
              >
                <Web3ReactManager>
                  <Updaters />
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </Web3ReactManager>
              </SnackbarProvider>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </ThemeProvider>
      </PersistGate>
    </React.Fragment>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default wrapper.withRedux(MyApp);
