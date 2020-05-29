import Header from "../components/Header";
import fetch from "isomorphic-unfetch";
import ThemeToggler from "../components/ThemeToggler";

const Index = (props) => {
  return (
    <div>
      <Header />
      {props.featuredProducts.map((product) => (
        <p key={product._id}>{product.name}</p>
      ))}
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
