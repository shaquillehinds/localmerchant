import validator from "validator";
import axios from "axios";

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
const validateAll = async (fields, state, mode, type, setState) => {
  const names = ["userName", "storeName", "firstName", "lastName"];
  const isValid = fields.every((fieldName) => {
    if (fieldName === "email") {
      if (!validator.isEmail(state[fieldName])) {
        setState((prev) => ({
          ...prev,
          tip: { email: "Enter Valid Email" },
        }));
        return false;
      }
      return true;
    } else if (names.includes(fieldName)) {
      if (!(state[fieldName].length > 2)) {
        let tip = {};
        tip[fieldName] = "*Required";
        setState((prev) => ({ ...prev, tip }));
        return false;
      }
      return true;
    } else if (fieldName === "password" || fieldName === "address") {
      if (!(state[fieldName].length > 6)) {
        let tip = {};
        fieldName === "password"
          ? (tip[fieldName] = "7 character or more")
          : (tip[fieldName] = "*required");
        setState((prev) => ({ ...prev, tip }));
        return false;
      }
      return true;
    } else if (fieldName === "phone") {
      if (!validator.isMobilePhone(state[fieldName])) {
        setState((prev) => ({
          ...prev,
          tip: { phone: "Numbers only! 7 digits +" },
        }));
        return false;
      }
      return true;
    } else if (fieldName === "industry") {
      if (!(state[fieldName].length !== 0 && state[fieldName] !== "Industry")) {
        setState((prev) => ({
          ...prev,
          tip: { industry: "*Required" },
        }));
        return false;
      }
      return true;
    } else if (fieldName === "parish") {
      if (!(state[fieldName].length !== 0 && state[fieldName] !== "Parish")) {
        setState((prev) => ({
          ...prev,
          tip: { parish: "*Required" },
        }));
        return false;
      }
      return true;
    }
  });
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
        location.href = "/";
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
          location.href = "/";
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
          location.href = "/";
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

export { inputValidate, validateAll };