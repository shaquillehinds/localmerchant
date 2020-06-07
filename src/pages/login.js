import Form from "../components/Form";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import styles from "../styles/pages/login.module.scss";
import button from "../styles/components/elements/button.module.scss";
const Login = () => {
  const [state, setState] = useState({ mode: "login", type: "customer" });
  const changeType = (e) => {
    const type = e.target.innerText.toLowerCase();
    setState((prev) => ({ ...prev, type }));
  };
  const changeMode = (e) => {
    const type = e.target.innerText.toLowerCase();
    if (state.type !== type) {
      setState((prev) => ({ ...prev, type }));
    }
    if (state.mode === "login") {
      setState((prev) => ({ ...prev, mode: "customer" }));
    } else {
      setState((prev) => ({ ...prev, mode: "login" }));
    }
  };
  return (
    <div className={styles.login}>
      <Header mode="form" />
      <div>
        <p className={styles.login_as_label}>
          {state.mode === "login" ? "Login as" : "Sign-up as"}
        </p>
      </div>
      <div className={styles.login_as}>
        <span
          data-customer
          onClick={changeType}
          className={
            state.type === "customer"
              ? button.btn_large_primary
              : button.btn_large
          }
        >
          Customer
        </span>
        <span
          data-store
          onClick={changeType}
          className={
            state.type === "customer"
              ? button.btn_large
              : button.btn_large_primary
          }
        >
          Store
        </span>
      </div>
      <Form mode={state.mode} type={state.type} />
      <div className={styles.login_options_wide}>
        <p>{state.mode !== "login" ? "Login" : "Sign-up"}</p>
        <p> as</p>
        <p onClick={changeMode} className={styles.login_option}>
          Customer
        </p>
        <p>or</p>
        <p onClick={changeMode} className={styles.login_option}>
          Store
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
