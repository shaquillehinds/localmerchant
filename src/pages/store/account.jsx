import AccountNav from "../../components/AccountNav";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import page from "../../styles/components/elements/page.module.scss";
import fonts from "../../styles/components/elements/fonts.module.scss";
import form from "../../styles/components/form.module.scss";
import cookies from "browser-cookies";
import ActionList from "../../components/ActionList";
import StoreInformation from "../../components/StoreInformation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const Account = () => {
  const router = useRouter();
  const [state, setState] = useState({
    accountType: undefined,
    settings: [
      { name: "Tokens", action: "Buy" },
      { name: "Store Information", action: "Edit" },
      { name: "Saved Categories", action: "Edit" },
      { name: "Store Coordinates", action: "Edit" },
      { name: "Store Hours", action: "Edit" },
      { name: "Delete Store", action: "Delete" },
    ],
    setting: false,
  });
  useEffect(() => {
    let accountType;
    cookies.get("customer") === "yes" ? (accountType = "customer") : (accountType = "store");
    setState((prev) => ({ ...prev, accountType }));
  }, []);
  const actionHandler = ({ name, action }) => {
    if (action === "Edit") setState((prev) => ({ ...prev, setting: name }));
    else if (action === "Buy" && name === "Tokens") router.push("/store/purchase");
    else if (action === "Delete" && name === "Delete Store") {
      console.log("Delete");
    } else if (action === "Done") setState((prev) => ({ ...prev, setting: false }));
  };
  return (
    <div>
      <Header />
      <AccountNav active={"account"} accountType={state.accountType} />
      <div className={page.setup_noflex} style={{ paddingTop: 1 + "rem" }}>
        <h2 className={fonts.heading_text} style={{ textAlign: "center" }}>
          Account
        </h2>
        {state.setting === "Store Information" ? (
          <StoreInformation actionHandler={actionHandler} />
        ) : (
          <ActionList settings={state.settings} actionHandler={actionHandler} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Account;
