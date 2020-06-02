import Header from "../components/Header";
import fetch from "isomorphic-unfetch";
import { useEffect, useState } from "react";
import styles from "../styles/pages/index.module.scss";
import HorizontalShowcase from "../components/HorizontalShowcase";
import ThemeToggler from "../components/ThemeToggler";

const Index = (props) => {
  const [state, setState] = useState({ displayItems: [] });
  useEffect(() => {
    fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query{
            products(store: "5ed11cbef48723638855ac1e") {
              image
              price
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setState((prev) => ({ ...prev, displayItems: data.data.products }));
      });
  }, []);
  return (
    <div className={styles.index}>
      <Header />
      <div className={styles.index__featured}>
        <h2>Featured Merch</h2>
        <HorizontalShowcase displayItems={state.displayItems} />
      </div>

      {/* {props.featuredProducts.map((product) => (
        <p key={product._id}>{product.name}</p>
      ))} */}
      <ThemeToggler />
    </div>
  );
};

export async function getStaticProps() {
  const appUrl = `${process.env.APP_URL}/api/product/featured/home page`;
  const res = await fetch(appUrl);
  const featuredProducts = await res.json();
  return { props: { featuredProducts, appUrl } };
}

export default Index;
