import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function Leave(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_226_104)" fill="#fff">
        {/* Power button circle */}
        <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        {/* Power symbol - vertical line with diagonal line */}
        <Path d="M13 7h-2v6h2V7z" />
        <Path d="M16.5 8.5l-1.4 1.4c.9 1.2 1.4 2.6 1.4 4.1 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-1.5.5-2.9 1.4-4.1L7.5 8.5c-1.1 1.5-1.7 3.2-1.7 5 0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.8-.6-3.5-1.7-5z" />
      </G>
      <Defs>
        <ClipPath id="clip0_226_104">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Leave;
