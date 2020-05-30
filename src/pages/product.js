import Header from "../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Search = () => {
  const [state, setState] = useState({ products: [] });
  const router = useRouter();
  const searchProducts = async () => {
    const search = window.location.search;
    try {
      const res = await fetch(`api/product${search}`);
      const products = await res.json();
      //   console.log(products);
      return setState((prev) => ({ ...prev, products }));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    searchProducts();
  }, [router.query]);
  return (
    <div>
      <Header />
      {state.products.length > 0
        ? state.products.map((product) => (
            <div key={product.__id}>
              <p>Name: {product.name}</p>
              <p>Price: {product.price}</p>
              <p>inStock: {product.inStock ? "Yes" : "No"}</p>
            </div>
          ))
        : null}
      {console.log(state.products)}
    </div>
  );
};

export default Search;
