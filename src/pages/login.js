import Form from "../components/Form";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import styles from "../styles/pages/login.module.scss";
import button from "../styles/components/elements/button.module.scss";
import divider from "../styles/components/elements/divider.module.scss";

const Login = () => {
  const [state, setState] = useState({ mode: false, type: "customer" });
  const changeType = (e) => {
    const type = e.target.innerText.toLowerCase();
    setState((prev) => ({ ...prev, type }));
  };
  const changeMode = (e) => {
    const type = e.target.innerText.toLowerCase();
    const value = e.target.attributes.value.value;
    if (state.type !== type) {
      setState((prev) => ({ ...prev, type }));
    }
    if (value === "login") {
      setState((prev) => ({ ...prev, mode: "login" }));
    } else if (value === "sign-up") {
      setState((prev) => ({ ...prev, mode: "sign-up" }));
    } else {
      setState((prev) => ({ ...prev, mode: false }));
    }
  };
  return (
    <div className={styles.login}>
      <Header mode="form" />
      {state.mode !== false ? (
        <p onClick={changeMode} value={false} className={styles.login_goback}>
          &#8592; Go Back
        </p>
      ) : null}
      {state.mode ? (
        <Form mode={state.mode} type={state.type} />
      ) : (
        <div className={styles.login_as_card_wrapper}>
          <div className={styles.login_as_card}>
            <div>
              <p className={styles.login_as_label}>Login As</p>
            </div>
            <div className={styles.login_as}>
              <span
                data-customer
                value="login"
                onClick={changeMode}
                className={button.btn_large_primary}
              >
                Customer
              </span>
              <span
                data-store
                value="login"
                onClick={changeMode}
                className={button.btn_large_primary}
              >
                Store
              </span>
            </div>
          </div>
          <br />
          <div className={divider.horizontal}>
            <div className={divider.horizontal_line}>
              <hr />
            </div>
            <p className={divider.horizontal_or}>or</p>
            <div className={divider.horizontal_line}>
              <hr />
            </div>
          </div>

          <br />
          <div className={styles.login_as_card_signup}>
            <div>
              <p className={styles.login_as_label}>Sign-Up As</p>
            </div>
            <div className={styles.login_as}>
              <span
                value="sign-up"
                data-customer
                onClick={changeMode}
                className={button.btn_large}
              >
                Customer
              </span>
              <span
                value="sign-up"
                data-store
                onClick={changeMode}
                className={button.btn_large}
              >
                Store
              </span>
            </div>
          </div>
        </div>
      )}
      {/* <div className={styles.login_options_wide}>
        <p>{state.mode !== "login" ? "Login" : "Sign-up"}</p>
        <p> as</p>
        <p onClick={changeMode} className={styles.login_option}>
          Customer
        </p>
        <p>or</p>
        <p onClick={changeMode} className={styles.login_option}>
          Store
        </p>
      </div> */}
      <Footer />
    </div>
  );
};

export default Login;
