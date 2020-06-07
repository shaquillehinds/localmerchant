import styles from "../styles/components/form.module.scss";
import button from "../styles/components/elements/button.module.scss";
import { useState } from "react";

const Form = ({ mode, type }) => {
  const [state, setState] = useState({ inputType: "password" });
  const showPassword = (e) => {
    const checked = document.getElementById("show").checked;
    if (checked) {
      setState((prev) => ({ ...prev, inputType: "text" }));
    } else {
      setState((prev) => ({ ...prev, inputType: "password" }));
    }
  };
  return (
    <div>
      {mode === "login" ? (
        <form className={styles.form}>
          <input
            placeholder="Email"
            className={styles.form_input}
            type="text"
          />
          <span className={styles.form_input_wrapper_col}>
            <input
              placeholder="Password"
              className={styles.form_input}
              type={state.inputType}
              className={styles.form_input}
            />
            <span onClick={showPassword}>
              <input
                className={styles.form_input_checkbox}
                type="checkbox"
                name="show"
                id="show"
              />
              <label className={styles.form_label_checkbox} htmlFor="show">
                Show Password
              </label>
            </span>
          </span>

          <button className={button.btn_primary}>Login</button>
        </form>
      ) : (
        <form className={styles.form_wide}>
          <span className={styles.form_input_wrapper}>
            <input
              placeholder="First Name"
              type="text"
              className={styles.form_input_narrow}
            />
            <input
              placeholder="Last Name"
              type="text"
              className={styles.form_input_narrow}
            />
          </span>
          <span className={styles.form_input_wrapper}>
            <input
              placeholder="Store Name"
              type="text"
              className={styles.form_input_narrow}
            />
            <input
              placeholder="Email"
              type="text"
              className={styles.form_input_narrow}
            />
          </span>
          {type === "customer" ? null : (
            <span className={styles.form_input_wrapper}>
              <input
                placeholder="Phone #"
                type="text"
                className={styles.form_input_narrow}
              />
              <select className={styles.form_select} required>
                <option defaultValue disabled value="">
                  Industry
                </option>
                <option value="Automotive">Automotive</option>
                <option value="Beauty">Beauty</option>
              </select>
            </span>
          )}
          {type === "customer" ? null : (
            <span className={styles.form_input_wrapper}>
              <input
                placeholder="Address"
                type="text"
                className={styles.form_input_narrow}
              />
              <select className={styles.form_select} required>
                <option defaultValue disabled value="">
                  Parish
                </option>
                <option value="St.James">St.James</option>
                <option value="St.John">St.John</option>
                <option value="St.Andrew">St.Andrew</option>
              </select>
            </span>
          )}
          <span className={styles.form_input_wrapper_col}>
            <input
              placeholder="Password"
              className={styles.form_input}
              type={state.inputType}
              className={styles.form_input}
            />
            <span onClick={showPassword}>
              <input
                className={styles.form_input_checkbox}
                type="checkbox"
                data-checkbox
                name="show"
                id="show"
              />
              <label className={styles.form_label_checkbox} htmlFor="show">
                Show Password
              </label>
            </span>
          </span>

          <button className={button.btn_primary}>Sign-Up</button>
        </form>
      )}
    </div>
  );
};

export default Form;
