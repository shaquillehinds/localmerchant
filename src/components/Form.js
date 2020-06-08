import styles from "../styles/components/form.module.scss";
import button from "../styles/components/elements/button.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import validator from "validator";
import axios from "axios";

const Form = ({ mode, type }) => {
  const router = useRouter();
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
  const sanitize = (obj) => {
    const input = document.querySelectorAll("[type]");
    // console.log(input);
  };
  const inputValidate = (input, condition) => {
    if (condition) {
      input.style.borderBottom = "solid 2px green";
      return true;
    } else if (input.value) {
      input.style.borderBottom = "solid 2px red";
      return false;
    } else {
      input.removeAttribute("style");
      return false;
    }
  };
  const validateAll = async (states) => {
    const names = ["userName", "storeName", "firstName", "lastName"];
    const isValid = states.every((stateName) => {
      if (stateName === "email") {
        if (!validator.isEmail(state[stateName])) {
          setState((prev) => ({
            ...prev,
            tip: { email: "Enter Valid Email" },
          }));
          return false;
        }
        return true;
      } else if (names.includes(stateName)) {
        if (!(state[stateName].length > 2)) {
          let tip = {};
          tip[stateName] = "*Required";
          setState((prev) => ({ ...prev, tip }));
          return false;
        }
        return true;
      } else if (stateName === "password" || stateName === "address") {
        if (!(state[stateName].length > 6)) {
          let tip = {};
          stateName === "password"
            ? (tip[stateName] = "7 character or more")
            : (tip[stateName] = "*required");
          setState((prev) => ({ ...prev, tip }));
          return false;
        }
        return true;
      } else if (stateName === "phone") {
        if (!validator.isMobilePhone(state[stateName])) {
          setState((prev) => ({
            ...prev,
            tip: { phone: "Numbers only! 7 digits +" },
          }));
          return false;
        }
        return true;
      } else if (stateName === "industry") {
        if (
          !(state[stateName].length !== 0 && state[stateName] !== "Industry")
        ) {
          setState((prev) => ({
            ...prev,
            tip: { industry: "*Required" },
          }));
          return false;
        }
        return true;
      } else if (stateName === "parish") {
        if (!(state[stateName].length !== 0 && state[stateName] !== "Parish")) {
          setState((prev) => ({
            ...prev,
            tip: { parish: "*Required" },
          }));
          return false;
        }
        return true;
      }
    });
    console.log(isValid);
    if (!isValid) {
      return null;
    }
    if (mode === "login") {
      try {
        const res = await axios({
          url: `/api/${type}/login`,
          method: "post",
          data: {
            email: state.email,
            password: state.password,
          },
        });
        if (res.data) {
          localStorage.setItem("JWT", res.data);
          router.push("/");
        }
      } catch (e) {
        setState((prev) => ({
          ...prev,
          tip: { email: "Invalid Email or Password" },
        }));
      }
    } else {
      if (type === "customer") {
        try {
          const res = await axios({
            url: `/api/customer`,
            method: "post",
            data: {
              firstName: state.firstName,
              lastName: state.lastName,
              userName: state.userName,
              email: state.email,
              password: state.password,
            },
          });
          if (res.data.userName) {
            setState((prev) => ({
              ...prev,
              tip: { userName: res.data.userName },
            }));
          } else if (res.data.email) {
            setState((prev) => ({
              ...prev,
              tip: { email: res.data.email },
            }));
          } else if (res.data.token) {
            localStorage.setItem("JWT", res.data.token);
            router.push("/");
          }
        } catch (e) {
          setState((prev) => ({
            ...prev,
            tip: { email: "Invalid Email or Password" },
          }));
        }
      } else {
        try {
          const res = await axios({
            url: `/api/store`,
            method: "post",
            data: {
              firstName: state.firstName,
              lastName: state.lastName,
              storeName: state.storeName,
              address: state.address,
              phone: state.phone,
              industry: state.industry,
              parish: state.parish,
              email: state.email,
              password: state.password,
            },
          });
          if (res.data.storeName) {
            setState((prev) => ({
              ...prev,
              tip: { storeName: res.data.storeName },
            }));
          } else if (res.data.email) {
            setState((prev) => ({
              ...prev,
              tip: { email: res.data.email },
            }));
          } else if (res.data.token) {
            localStorage.setItem("JWT", res.data.token);
            router.push("/");
          }
        } catch (e) {
          setState((prev) => ({
            ...prev,
            tip: { email: "Invalid Email or Password" },
          }));
        }
      }
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
    inputValidate(
      input,
      validator.isMobilePhone(input.value) && input.value.length >= 7
    );
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      const states = ["email", "password"];
      validateAll(states);
    } else {
      if (type === "customer") {
        const states = [
          "userName",
          "email",
          "password",
          "firstName",
          "lastName",
        ];
        validateAll(states);
      } else {
        const states = [
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
        validateAll(states);
      }
    }
  };
  return (
    <div>
      {mode === "login" ? (
        <form onSubmit={handleSubmit} className={styles.form}>
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
            <span
              data-tip={state.tip.password}
              className={styles.form_input_tip}
            >
              <input
                placeholder="Password"
                value={state.password}
                onChange={handlePassword}
                className={styles.form_input}
                type={state.inputType}
                className={styles.form_input}
              />
            </span>
            <span
              className={styles.form_input_checkbox_wrapper}
              onClick={showPassword}
            >
              <input
                className={styles.form_input_checkbox}
                type="checkbox"
                name="show"
                id="show"
              />
              <label
                className={styles.form_input_checkbox_label}
                htmlFor="show"
              >
                Show Password
              </label>
            </span>
          </span>

          <button className={button.btn_primary}>Login</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form_wide}>
          <span className={styles.form_input_wrapper}>
            <span
              data-tip={state.tip.firstName}
              className={styles.form_input_tip_narrow}
            >
              <input
                placeholder="First Name"
                value={state.firstName}
                onChange={handleFirstName}
                type="text"
                className={styles.form_input_narrow}
              />
            </span>
            <span
              data-tip={state.tip.lastName}
              className={styles.form_input_tip_narrow}
            >
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
              data-tip={
                state.tip.userName ? state.tip.userName : state.tip.storeName
              }
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
            <span
              data-tip={state.tip.email}
              className={styles.form_input_tip_narrow}
            >
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
              <span
                data-tip={state.tip.phone}
                className={styles.form_input_tip_narrow}
              >
                <input
                  placeholder="Phone #"
                  value={state.phone}
                  onChange={handlePhone}
                  type="text"
                  className={styles.form_input_narrow}
                />
              </span>
              <span
                data-tip={state.tip.industry}
                className={styles.form_input_tip}
              >
                <select
                  defaultValue="Industry"
                  // value={state.industry}
                  onChange={handleIndustry}
                  className={styles.form_select}
                  required
                >
                  <option className={styles.form_option} disabled>
                    Industry
                  </option>
                  <option value="Automotive">Automotive</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </span>
            </span>
          )}
          {type === "customer" ? null : (
            <span className={styles.form_input_wrapper}>
              <span
                data-tip={state.tip.address}
                className={styles.form_input_tip_narrow}
              >
                <input
                  placeholder="Address"
                  value={state.address}
                  onChange={handleAddress}
                  type="text"
                  className={styles.form_input_narrow}
                />
              </span>
              <span
                data-tip={state.tip.parish}
                className={styles.form_input_tip}
              >
                <select
                  defaultValue="Parish"
                  // value={state.parish}
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
                </select>
              </span>
            </span>
          )}
          <span className={styles.form_input_wrapper_col}>
            <span
              data-tip={state.tip.password}
              className={styles.form_input_tip}
            >
              <input
                placeholder="Password"
                value={state.password}
                onChange={handlePassword}
                className={styles.form_input}
                type={state.inputType}
                className={styles.form_input}
              />
            </span>
            <span
              className={styles.form_input_checkbox_wrapper}
              onClick={showPassword}
            >
              <input
                className={styles.form_input_checkbox}
                type="checkbox"
                data-checkbox
                name="show"
                id="show"
              />
              <label
                className={styles.form_input_checkbox_label}
                htmlFor="show"
              >
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
