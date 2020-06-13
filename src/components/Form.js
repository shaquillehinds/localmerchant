import styles from "../styles/components/form.module.scss";
import button from "../styles/components/elements/button.module.scss";
import { useState } from "react";
import validator from "validator";
import { validateAll, inputValidate } from "../functions/formValidation";

const Form = ({ mode, type }) => {
  const [state, setState] = useState({
    inputType: "password",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    address: "",
    industry: "",
    parish: "",
    storeName: "",
    tip: {},
  });
  const showPassword = (e) => {
    const checked = document.getElementById("show").checked;
    if (checked) {
      setState((prev) => ({ ...prev, inputType: "text" }));
    } else {
      setState((prev) => ({ ...prev, inputType: "password" }));
    }
  };

  const handleEmail = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, validator.isEmail(input.value));
    setState((prev) => ({ ...prev, email: input.value }));
  };
  const handlePassword = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length >= 7);
    setState((prev) => ({ ...prev, password: input.value }));
  };
  const handleName = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length > 2);
    if (type === "customer") {
      setState((prev) => ({ ...prev, userName: input.value }));
    } else {
      setState((prev) => ({ ...prev, storeName: input.value }));
    }
  };
  const handleFirstName = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length > 2);
    setState((prev) => ({ ...prev, firstName: input.value }));
  };
  const handleLastName = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length > 2);
    setState((prev) => ({ ...prev, lastName: input.value }));
  };
  const handleAddress = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length > 6);
    setState((prev) => ({ ...prev, address: input.value }));
  };
  const handlePhone = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, validator.isMobilePhone(input.value) && input.value.length >= 7);
    setState((prev) => ({ ...prev, phone: input.value }));
  };
  const handleIndustry = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length !== 0 && input !== "Industry");
    setState((prev) => ({ ...prev, industry: input.value }));
  };
  const handleParish = (e) => {
    e.persist();
    const input = e.target;
    inputValidate(input, input.value.length !== 0 && input !== "parish");
    setState((prev) => ({ ...prev, parish: input.value }));
  };
  const removeTip = (e) => {
    if (Object.keys(state.tip).length > 0) {
      console.log("here");
      return setState((prev) => ({ ...prev, tip: {} }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    if (mode === "login") {
      const fields = ["email", "password"];
      validateAll(fields, state, mode, type, setState);
    } else {
      if (type === "customer") {
        const fields = ["userName", "email", "password", "firstName", "lastName"];
        validateAll(fields, state, mode, type, setState);
      } else {
        const fields = [
          "storeName",
          "address",
          "phone",
          "industry",
          "parish",
          "email",
          "password",
          "firstName",
          "lastName",
        ];
        validateAll(fields, state, mode, type, setState);
      }
    }
  };
  return (
    <div>
      {mode === "login" ? (
        <form onKeyDown={removeTip} onSubmit={handleSubmit} className={styles.form}>
          <span data-tip={state.tip.email} className={styles.form_input_tip}>
            <input
              placeholder="Email"
              value={state.email}
              onChange={handleEmail}
              className={styles.form_input}
              type="text"
            />
          </span>
          <span className={styles.form_input_wrapper_col}>
            <span data-tip={state.tip.password} className={styles.form_input_tip}>
              <input
                placeholder="Password"
                value={state.password}
                onChange={handlePassword}
                className={styles.form_input}
                type={state.inputType}
                className={styles.form_input}
              />
            </span>
            <span className={styles.form_input_checkbox_wrapper} onClick={showPassword}>
              <input className={styles.form_input_checkbox} type="checkbox" name="show" id="show" />
              <label className={styles.form_input_checkbox_label} htmlFor="show">
                Show Password
              </label>
            </span>
          </span>

          <button className={button.btn_primary}>Login</button>
        </form>
      ) : (
        <form onKeyDown={removeTip} onSubmit={handleSubmit} className={styles.form_wide}>
          <span className={styles.form_input_wrapper}>
            <span data-tip={state.tip.firstName} className={styles.form_input_tip_narrow}>
              <input
                placeholder="First Name"
                value={state.firstName}
                onChange={handleFirstName}
                type="text"
                className={styles.form_input_narrow}
              />
            </span>
            <span data-tip={state.tip.lastName} className={styles.form_input_tip_narrow}>
              <input
                placeholder="Last Name"
                value={state.lastName}
                onChange={handleLastName}
                type="text"
                className={styles.form_input_narrow}
              />
            </span>
          </span>
          <span className={styles.form_input_wrapper}>
            <span
              data-tip={state.tip.userName ? state.tip.userName : state.tip.storeName}
              className={styles.form_input_tip_narrow}
            >
              <input
                placeholder={type === "customer" ? "User Name" : "Store Name"}
                value={type === "customer" ? state.userName : state.storeName}
                onChange={handleName}
                type="text"
                className={styles.form_input_narrow}
              />
            </span>
            <span data-tip={state.tip.email} className={styles.form_input_tip_narrow}>
              <input
                placeholder="Email"
                type="text"
                value={state.email}
                onChange={handleEmail}
                className={styles.form_input_narrow}
              />
            </span>
          </span>
          {type === "customer" ? null : (
            <span className={styles.form_input_wrapper}>
              <span data-tip={state.tip.phone} className={styles.form_input_tip_narrow}>
                <input
                  placeholder="Phone #"
                  value={state.phone}
                  onChange={handlePhone}
                  type="text"
                  className={styles.form_input_narrow}
                />
              </span>
              <span data-tip={state.tip.industry} className={styles.form_input_tip}>
                <select
                  defaultValue="Industry"
                  onChange={handleIndustry}
                  className={styles.form_select}
                  required
                >
                  <option className={styles.form_option} disabled>
                    Industry
                  </option>
                  <option value="Automotive">Automotive</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Jewelry">Jewelry</option>
                </select>
              </span>
            </span>
          )}
          {type === "customer" ? null : (
            <span className={styles.form_input_wrapper}>
              <span data-tip={state.tip.address} className={styles.form_input_tip_narrow}>
                <input
                  placeholder="Address"
                  value={state.address}
                  onChange={handleAddress}
                  type="text"
                  className={styles.form_input_narrow}
                />
              </span>
              <span data-tip={state.tip.parish} className={styles.form_input_tip}>
                <select
                  defaultValue="Parish"
                  onChange={handleParish}
                  className={styles.form_select}
                  required
                >
                  <option className={styles.form_option} disabled>
                    Parish
                  </option>
                  <option value="St.James">St.James</option>
                  <option value="St.John">St.John</option>
                  <option value="St.Andrew">St.Andrew</option>
                  <option value="St.Michael">St.Michael</option>
                  <option value="Christ Church">Christ Church</option>
                </select>
              </span>
            </span>
          )}
          <span className={styles.form_input_wrapper_col}>
            <span data-tip={state.tip.password} className={styles.form_input_tip}>
              <input
                placeholder="Password"
                value={state.password}
                onChange={handlePassword}
                className={styles.form_input}
                type={state.inputType}
                className={styles.form_input}
              />
            </span>
            <span className={styles.form_input_checkbox_wrapper} onClick={showPassword}>
              <input
                className={styles.form_input_checkbox}
                type="checkbox"
                data-checkbox
                name="show"
                id="show"
              />
              <label className={styles.form_input_checkbox_label} htmlFor="show">
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
