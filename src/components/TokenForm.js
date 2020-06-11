import button from "../styles/components/elements/button.module.scss";
import fonts from "../styles/components/elements/fonts.module.scss";
import form from "../styles/components/form.module.scss";
import { useState } from "react";

const TokenField = ({ offeredTokens, buyHandler }) => {
  return (
    <div
      style={{
        height: 100 + "%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      {offeredTokens.map((offered) => {
        return (
          <span key={offered.type} className={form.form_input_wrapper_col}>
            <div className={fonts.heading_container}>
              <h2
                className={fonts.heading_text}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: 1.5 + "rem",
                  marginBottom: 0 + "rem",
                }}
              >
                {offered.tokenName}
              </h2>
            </div>
            <div className={fonts.heading_container}>
              <p
                className={fonts.text_m}
                style={{
                  fontWeight: 600,
                  fontSize: 1.5 + "rem",
                  marginBottom: 1 + "rem",
                }}
              >
                {offered.tokenPrice}
              </p>
            </div>
            <span className={form.form_input_wrapper}>
              <input
                type="number"
                className={form.form_input_narrow}
                min={1}
                defaultValue={1}
                placeholder="Quantity"
              />
              <span className={form.form_input_narrow} style={{ border: "none" }}>
                <button
                  className={button.btn_primary}
                  onClick={(e) => {
                    const quantity = parseInt(
                      e.target.parentElement.parentElement.firstElementChild.value
                    );
                    console.log(quantity);
                    buyHandler(offered.type, quantity);
                  }}
                >
                  Buy
                </button>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
};

const TokenForm = ({ offeredTokens, buyHandler }) => {
  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={submitHandler} className={form.form_wide}>
      <TokenField offeredTokens={offeredTokens} buyHandler={buyHandler} />
      <div>
        <br />
      </div>
    </form>
  );
};

export default TokenForm;
