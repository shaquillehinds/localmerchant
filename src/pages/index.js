import Header from "../components/header";
import { useEffect } from "react";
import fetch from "isomorphic-unfetch";
import router from "next/router";

const Index = (props) => {
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
      {props.merchants.map((merchant) => (
        <p key={merchant.businessName}>{merchant.businessName}</p>
      ))}
    </div>
  );
};

Index.getInitialProps = async () => {
  const appUrl = `${process.env.APP_URL}/api/merchant`;
  const res = await fetch(appUrl);
  const merchants = await res.json();
  return { merchants, appUrl };
};

export default Index;
