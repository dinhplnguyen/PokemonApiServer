import React from "react";
import { gsap } from "gsap";

const { useLayoutEffect, useRef } = React;

export default function Ghost() {

  const app = useRef();

  useLayoutEffect(() => {
    // flip the card
    gsap.to(app.current, { duration: 1, rotationY: 180 });
  }, []);

  return (
    <div>
      <div className="error__img">
        <img src="https://raw.githubusercontent.com/bedimcode/responsive-404-page/main/assets/img/ghost-img.png" alt="" />
        <div className="error__shadow"></div>
      </div>
    </div>
  );
}