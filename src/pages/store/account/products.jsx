import AccountNav from "../../../components/AccountNav";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ProductCard from "../../../components/ProductCard";
import page from "../../../styles/components/elements/page.module.scss";
import fonts from "../../../styles/components/elements/fonts.module.scss";
import form from "../../../styles/components/form.module.scss";
import card from "../../../styles/components/product-card.module.scss";
import cookies from "browser-cookies";
import { useEffect, useState } from "react";
import axios from "axios";
import { graphqlRenderedFetch } from "../../../functions/api";

const PRODUCTS_QUERY = `
  query {
    products(private: true) {
      _id
      name
      price
      image
      store{
        storeName
      }
    }
  }
`;
const Products = () => {
  const [state, setState] = useState({ accountType: undefined, products: [] });
  useEffect(() => {
    let accountType;
    cookies.get("customer") === "yes" ? (accountType = "customer") : (accountType = "store");
    setState((prev) => ({ ...prev, accountType }));
    (async () => {
      const products = (await graphqlRenderedFetch(PRODUCTS_QUERY)).products;
      setState((prev) => ({ ...prev, products }));
    })();
  }, []);
  const handleBoost = async (e) => {
    const id = e.target.getAttribute("data-id");
    const url = `/api/product/featured?product=${id}`;
    try {
      const data = await axios({
        method: "post",
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      alert("Product Boosted");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Header />
      <AccountNav active={"products"} accountType={state.accountType} />
      <div className={page.setup_noflex} style={{ paddingTop: 1 + "rem" }}>
        <h2 className={fonts.heading_text} style={{ textAlign: "center" }}>
          My Store Products
        </h2>
        <form>
          <span
            className={form.form_input_wrapper}
            style={{ padding: 2 + "rem", maxWidth: 40 + "rem", marginLeft: "auto", marginRight: "auto" }}
          >
            <input
              className={form.form_input_narrow}
              placeholder="Search Filter"
              type="text"
              name="filter"
              id="filter"
            />
            <select className={form.form_select} defaultValue="Sort By">
              <option className={form.form_option} disabled>
                Sort By
              </option>
              <option value="Date (New)">Date (New)</option>
              <option value="Date (Old)">Date (Old)</option>
              <option value="Name (Asc)">Name (Asc)</option>
              <option value="Name (Des)">Name (Des)</option>
            </select>
          </span>
        </form>
        <div className={card.product_cards}>
          {state.products.map((product) => {
            return (
              <ProductCard
                handleBoost={handleBoost}
                mode="private"
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                storeName={product.store.storeName}
                image={product.image}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
