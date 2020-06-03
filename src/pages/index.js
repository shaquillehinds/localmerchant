import Header from "../components/Header";
import fetch from "isomorphic-unfetch";
import { useEffect, useState } from "react";
import styles from "../styles/pages/index.module.scss";
import loaders from "../styles/components/elements/loaders.module.scss";
import HorizontalShowcase from "../components/HorizontalShowcase";
import ThemeToggler from "../components/ThemeToggler";

const FEATURED_PRODUCTS_QUERY = `
  query {
    products(store: "5ed11cbef48723638855ac1e") {
      _id
      image
      price
    }
  }
`;
const WEEKLY_TRENDS_QUERY = `
  query{
    weeklyViews{
      product {
        _id
        image
        price
      }
    }
  }
`;

const graphqlFetch = async (query) => {
  const json = await fetch(`${process.env.APP_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
    }),
  });
  const res = (await json.json()).data;
  return res;
};

const Index = (props) => {
  const [state, setState] = useState({ featureItems: [], trendItems: [] });
  useEffect(() => {
    setState((prev) => ({ ...prev, featureItems: props.featureItems }));
    const trendItems = props.trendItems.weeklyViews.map((item) => item.product);
    console.log(trendItems);
    setState((prev) => ({ ...prev, trendItems }));
  }, []);
  return (
    <div className={styles.index}>
      <Header />
      <div className={styles.index__featured}>
        <h2>Featured Merch</h2>
        {state.featureItems.length > 0 ? (
          <HorizontalShowcase displayItems={state.featureItems} />
        ) : (
          <div className={loaders.ring__loader}></div>
        )}
      </div>
      <div className={styles.index__featured}>
        <h2>Trending</h2>
        {state.trendItems.length > 0 ? (
          <HorizontalShowcase displayItems={state.trendItems} />
        ) : (
          <div className={loaders.ring__loader}></div>
        )}
      </div>
      {/* {props.featuredProducts.map((product) => (
        <p key={product._id}>{product.name}</p>
      ))} */}
      <ThemeToggler />
    </div>
  );
};

export async function getStaticProps() {
  // const appUrl = `${process.env.APP_URL}/api/product/featured/home page`;
  // const res = await fetch(appUrl);
  // const featuredProducts = await res.json();
  const featureItems = (await graphqlFetch(FEATURED_PRODUCTS_QUERY)).products;
  const trendItems = await graphqlFetch(WEEKLY_TRENDS_QUERY);
  return { props: { featureItems, trendItems } };
}

export default Index;
