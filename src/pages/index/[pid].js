import Header from "../../components/Header";
import ThemeToggler from "../../components/ThemeToggler";
import { useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import styles from "../../styles/pages/index.module.scss";

const Index = (props) => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/store`);
      const merchants = await res.json();
      console.log(merchants);
    })();
  }, []);
  return (
    <div className={styles.index}>
      <h1>Index Page</h1>
      <Header />
      {props.products.map((product) => (
        <p key={product.name}>{product.name}</p>
      ))}
      <ThemeToggler />
    </div>
  );
};

Index.getInitialProps = async ({ query }) => {
  const appUrl = `${process.env.APP_URL}/api/store/${query.pid}/products`;
  const res = await fetch(appUrl);
  const products = await res.json();
  return { products, appUrl };
};

export default Index;
