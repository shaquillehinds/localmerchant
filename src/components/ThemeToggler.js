import { useState } from "react";

const ThemeToggler = () => {
  const [state, setState] = useState({ dark: false });
  const thoggleTheme = () => {
    const body = document.querySelector("body");
    if (body.getAttribute("data-theme")) {
      body.removeAttribute("data-theme");
    } else {
      body.setAttribute("data-theme", "dark");
    }
    setState((prev) => ({ dark: !prev.dark }));
  };
  return (
    <div>
      <button onClick={thoggleTheme}>{state.dark ? <p>Light Theme</p> : <p>Dark Theme</p>}</button>
    </div>
  );
};

export default ThemeToggler;
