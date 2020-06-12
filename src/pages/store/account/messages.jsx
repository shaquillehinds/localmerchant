import AccountNav from "../../../components/AccountNav";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import page from "../../../styles/components/elements/page.module.scss";
import fonts from "../../../styles/components/elements/fonts.module.scss";
import form from "../../../styles/components/form.module.scss";
import cookies from "browser-cookies";
import { useEffect, useState } from "react";
const Products = () => {
  const [state, setState] = useState({ accountType: undefined });
  useEffect(() => {
    let accountType;
    cookies.get("customer") === "yes" ? (accountType = "customer") : (accountType = "store");
    setState((prev) => ({ ...prev, accountType }));
  }, []);
  return (
    <div>
      <Header />
      <AccountNav active={"messages"} accountType={state.accountType} />
      <div className={page.setup_noflex} style={{ paddingTop: 1 + "rem" }}>
        <h2 className={fonts.heading_text} style={{ textAlign: "center" }}>
          Messages
        </h2>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
