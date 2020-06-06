import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchProducts } from "../functions/api";

const Product = () => {
  const [state, setState] = useState({ products: [] });
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const products = await searchProducts();
      setState((prev) => ({ ...prev, products }));
    })();
  }, [router.query]);
  return (
    <div>
      <Header />
      {state.products.map((product) => (
        <div key={product._id}>
          <p>Name: {product.name}</p>
          <p>Price: {product.price}</p>
          <p>inStock: {product.inStock ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
};

export default Product;
