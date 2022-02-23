import { Desktop, Mobile } from "components/utils/responsive";
import React from "react";
import HeaderDesktop from "./Desktop";
import HeaderMobile from "./Mobile";

const Header = (props) => (
  <React.Fragment>
    <Desktop>
      <HeaderDesktop {...props} />
    </Desktop>
    <Mobile>
      <HeaderMobile {...props} />
    </Mobile>
  </React.Fragment>
);
export default Header;
