import Image from "next/image";
import { useEffect, useState } from "react";
export default function Toogle() {
  const [currentMode, setCurrentMode] = useState();
  useEffect(() => {
    setCurrentMode(myFunction_get("--bg-dark"));
  }, []);
  function myFunction_get(name) {
    const r = document.querySelector(":root");
    const rs = getComputedStyle(r);
    return rs.getPropertyValue(name);
  }
  const CurrentMode = () => {
    if (currentMode == "rgb(243, 242, 242)")
      return (
        <Image
          src="/dark_mode.svg"
          height="30"
          width="30"
          onClick={toogle}
          alt="darkmode"
        />
      );
    else
      return (
        <Image
          src="/light_mode.svg"
          height="30"
          width="30"
          layout="fixed"
          onClick={toogle}
          alt="lightmode"
        />
      );
  };
  const toogle = () => {
    const mode = myFunction_get("--bg-dark");
    const r = document.querySelector(":root");
    const scheme =
      "rgb(243, 242, 242)" == mode ? "rgb(56, 52, 52)" : "rgb(243, 242, 242)";
    setCurrentMode(scheme);
    r.style.setProperty("--bg-dark", scheme);
    r.style.setProperty(
      "--color-primary-light",
      "black" == myFunction_get("--color-primary-light") ? "white" : "black"
    );
  };
  return <CurrentMode />;
}
