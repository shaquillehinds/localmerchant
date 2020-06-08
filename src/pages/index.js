import Header from "../components/Header";
import Footer from "../components/Footer";
import { graphqlFetch } from "../functions/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/pages/index.module.scss";
import loaders from "../styles/components/elements/loaders.module.scss";
import HorizontalShowcase from "../components/HorizontalShowcase";
import ThemeToggler from "../components/ThemeToggler";

const FEATURED_PRODUCTS_QUERY = `
  query {
    featured(category: "products"){
      image
      price
    }
  }
`;

const FEATURED_STORES_QUERY = `
query{
  featured(category: "stores"){
    image
    storeName
  }
}`;

const WEEKLY_TRENDS_QUERY = `
  query{
    featured(category: "weekly_trends"){
      image
      price
    }
  }
`;

const Index = (props) => {
  const [state, setState] = useState({
    featuredItems: [],
    trendItems: [],
    featuredStores: [],
  });
  useEffect(() => {
    setState((prev) => ({ ...prev, featuredItems: props.featuredItems }));
    setState((prev) => ({ ...prev, trendItems: props.trendItems }));
    setState((prev) => ({ ...prev, featuredStores: props.featuredStores }));
  }, []);
  return (
    <div className={styles.index}>
      <Header />
      <div className={styles.index__featured}>
        <h2>Featured Merch</h2>
        {state.featuredItems.length > 0 ? (
          <HorizontalShowcase displayItems={state.featuredItems} />
        ) : (
          <div className={loaders.ring__loader}></div>
        )}
      </div>
      <div className={styles.index__featured}>
        <h2 className={styles.index__heading}>Stores</h2>
        <div className={styles.index__stores}>
          {state.featuredStores.length > 0 ? (
            <HorizontalShowcase displayItems={state.featuredStores} />
          ) : (
            <div className={loaders.ring__loader}></div>
          )}
          <Link href="/">
            <p className={styles.index__stores__view_all}>View All Stores</p>
          </Link>
        </div>
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
      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  // const appUrl = `${process.env.APP_URL}/api/product/featured/home page`;
  // const res = await fetch(appUrl);
  // const featuredProducts = await res.json();
  const featuredItems = (await graphqlFetch(FEATURED_PRODUCTS_QUERY)).featured;
  const trendItems = (await graphqlFetch(WEEKLY_TRENDS_QUERY)).featured;
  const featuredStores = (await graphqlFetch(FEATURED_STORES_QUERY)).featured;
  return { props: { featuredItems, featuredStores, trendItems } };
}

export default Index;
