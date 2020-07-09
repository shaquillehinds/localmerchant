import styles from "../styles/components/store-information.module.scss";
import form from "../styles/components/form.module.scss";
import btn from "../styles/components/elements/button.module.scss";
import { useState, useEffect } from "react";
import { graphqlRenderedFetch } from "../functions/api";
import { validateAll, inputValidate } from "../functions/formValidation";

const INFO_QUERY = `
query{
    store{
        firstName
        lastName
        storeName
        email
        phone
        phone2
        address
        parish
    }
}
`;
const parishes = [
  "St.Lucy",
  "St.Peter",
  "St.Andrew",
  "St.James",
  "St.Thomas",
  "St.John",
  "St.Michael",
  "St.George",
  "St.Phillip",
  "St.Joseph",
  "Christ Church",
];
const StoreInformation = ({ actionHandler }) => {
  const [state, setState] = useState({ initialInfo: undefined, updatedInfo: undefined, tip: {} });
  useEffect(() => {
    (async () => {
      const store = (await graphqlRenderedFetch(INFO_QUERY)).store;
      store.password = undefined;
      setState((prev) => ({ initialInfo: store, updatedInfo: store, tip: {} }));
      console.log(store);
    })();
  }, []);
  const updateInfoHandler = (value, i) => {
    const update = {};
    update[i] = value;
    setState((prev) => ({ ...prev, updatedInfo: { ...prev.updatedInfo, ...update } }));
  };
  const saveHandler = async () => {
    const isUpdated = Object.keys(state.updatedInfo).every(
      (field) => state.updatedInfo[field] === state.initialInfo[field]
    );
    if (!isUpdated) {
      console.log(isUpdated);
      const validateState = { tip: state.tip };
      const fields = Object.keys(state.updatedInfo);
      const updatedFields = fields.filter(
        (field) => state.initialInfo[field] !== state.updatedInfo[field]
      );
      console.log(updatedFields);
      updatedFields.forEach((field) => (validateState[field] = state.updatedInfo[field]));
      const validated = await validateAll(updatedFields, validateState, "update", "edit", setState);
      if (validated === "success") actionHandler({ action: "Done" });
    }
  };
  const renderInfo = (info) => {
    return Object.keys(info).map((i) => (
      <div className={styles.info_container} key={i}>
        <h5 className={styles.info_title}>
          {i.includes("Name")
            ? i[0].toUpperCase() + i.slice(1, i.indexOf("Name")) + " Name"
            : i[0].toUpperCase() + i.slice(1, i.length)}
        </h5>
        {i === "parish" ? (
          <select
            className={form.form_select}
            onChange={(e) => {
              const value = e.target.value;
              updateInfoHandler(value, i);
            }}
          >
            <option value={state.initialInfo[i]}>{state.initialInfo[i]}</option>
            {parishes.map((parish) => {
              if (state.initialInfo[i] !== parish) {
                return (
                  <option key={parish} value={parish}>
                    {parish}
                  </option>
                );
              }
            })}
          </select>
        ) : (
          <span data-tip={state.tip[i]} id="here" className={form.form_input_tip}>
            <input
              className={form.form_input}
              style={{ backgroundColor: "rgb(250, 250, 250)", paddingLeft: "5px" }}
              type="text"
              value={state.updatedInfo[i] ? state.updatedInfo[i] : ""}
              onChange={(e) => {
                const input = e.target;
                const value = input.value;
                updateInfoHandler(value, i);
              }}
            ></input>
          </span>
        )}
      </div>
    ));
  };
  return (
    <div className={styles.info_wrapper}>
      <h3 className={styles.info_heading}>Store Information</h3>
      {state.initialInfo ? renderInfo(state.initialInfo) : null}
      <button onClick={saveHandler} style={{ margin: "2rem 0" }} className={btn.btn_primary}>
        Save
      </button>
      <button onClick={() => actionHandler({ action: "Done" })} className={btn.btn_link}>
        Cancel
      </button>
    </div>
  );
};
export default StoreInformation;
