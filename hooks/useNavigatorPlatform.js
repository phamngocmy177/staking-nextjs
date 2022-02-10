import React from "react";

// Hook
function useNavigatorPlatform() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [navigatorPlatform, setNavigatorPlatform] = React.useState(undefined);

  React.useEffect(() => {
    setNavigatorPlatform(navigator.platform);
  }, []); // Empty array ensures that effect is only run on mount

  return navigatorPlatform || "";
}

export default useNavigatorPlatform;
