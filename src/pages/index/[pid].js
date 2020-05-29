import Header from "../../components/header";
import { useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";

const Index = (props) => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/merchant`);
      const merchants = await res.json();
      console.log(merchants);
    })();
  }, []);
  return (
    <div>
      <h1>Index Page</h1>
      <Header />
      {props.products.map((product) => (
        <p key={product.name}>{product.name}</p>
      ))}
      {console.log(router.query)}
      {console.log(props)}
    </div>
  );
};

Index.getInitialProps = async ({ query }) => {
  const appUrl = `${process.env.APP_URL}/api/merchant/${query.pid}/products`;
  const res = await fetch(appUrl);
  const products = await res.json();
  return { products, appUrl };
};

export default Index;
