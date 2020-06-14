import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchProducts } from "../functions/api";
import ProductCard from "../components/ProductCard";

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
        <ProductCard
          mode="public"
          key={product._id}
          id={product._id}
          name={product.name}
          price={product.price}
          storeName={product.store.storeName}
          inStock={product.inStock}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default Product;
