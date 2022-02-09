import { Desktop } from "components/utils/responsive";
import React from "react";
import HeaderDesktop from "./Desktop";

const Header = (props) => (
  <React.Fragment>
    <Desktop>
      <HeaderDesktop {...props} />
    </Desktop>
    {/* <Mobile>
      <HeaderMobile {...props} />
    </Mobile> */}
  </React.Fragment>
);
export default Header;
