import AccountNav from "../../../components/AccountNav";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ProductCard from "../../../components/ProductCard";
import page from "../../../styles/components/elements/page.module.scss";
import button from "../../../styles/components/elements/button.module.scss";
import fonts from "../../../styles/components/elements/fonts.module.scss";
import FilterSort from "../../../components/FilterSort";
import card from "../../../styles/components/product-card.module.scss";
import cookies from "browser-cookies";
import { useEffect, useState, createContext } from "react";
import Link from "next/link";
import axios from "axios";
import { graphqlRenderedFetch } from "../../../functions/api";

export const AccountProductsContext = createContext(null);

const PRODUCTS_QUERY = `
  query {
    products(private: true) {
      _id
      name
      price
      image
      inStock
      store{
        _id
        storeName
        storeURL
      }
    }
  }
`;
const Products = () => {
  const [state, setState] = useState({ accountType: undefined, products: [], page: 0 });
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
  const handleFilterSort = async (products) => {
    setState((prev) => ({ ...prev, products }));
  };
  return (
    <div>
      <Header />
      <AccountNav active={"products"} accountType={state.accountType} />
      <div className={page.setup_noflex} style={{ paddingTop: 1 + "rem" }}>
        <h2
          onClick={() => {
            setState((prev) => ({ ...prev, page: prev.page + 1 }));
          }}
          className={fonts.heading_text}
          style={{ textAlign: "center" }}
        >
          My Store Products
        </h2>
        {state.products ? (
          <AccountProductsContext.Provider value={{ providerState: state }}>
            <FilterSort mode="privateProducts" handleFilterSort={handleFilterSort} />
          </AccountProductsContext.Provider>
        ) : null}
        <Link href="/product/new">
          <a
            style={{ display: "block", margin: "0 auto", fontSize: "var(--font-m)" }}
            className={button.btn_primary}
          >
            New Product
          </a>
        </Link>
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
                inStock={product.inStock}
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
