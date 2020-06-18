import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchProducts, graphqlFetch } from "../functions/api";
import ProductCard from "../components/ProductCard";
import transformNumber from "../functions/numberTransformer";

const CATEGORIES_QUERY = (level, category) => {
  return `query{
      categories (level: "${level}", category: "${category}"){
        subCategories
      }
    }`;
};

const Product = () => {
  const [state, setState] = useState({ products: [], query: "", key: "" });
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const products = await searchProducts();
      const query = router.query.search || router.query.category;
      let key;
      router.query.search ? (key = "search") : (key = "category");
      if (!query) {
        router.push("/");
      }
      setState((prev) => ({ ...prev, products, query, key }));
    })();
  }, [router.query]);
  return (
    <div>
      <Header />
      {router.query.search || router.query.category ? (
        <div>
          {state.products.length > 0 ? (
            <div>
              {state.products[0].tags ? (
                <div>
                  {state.products[0].tags.map((tag, index, tags) => {
                    if (index > tags.indexOf(state.query)) {
                      return null;
                    }
                    if (index == tags.indexOf(state.query)) {
                      let level;
                      let category;
                      state.key === "category"
                        ? (level = transformNumber(index + 1))
                        : (level = transformNumber(index));
                      state.key === "category" ? (category = tags[index]) : (category = tags[index - 1]);
                      console.log(level, category);
                      graphqlFetch(CATEGORIES_QUERY(level, category)).then((res) => {
                        if (res) {
                          if (res.categories) {
                            if (res.categories.subCategories) {
                              console.log(res.categories.subCategories);
                            }
                          }
                        }
                      });
                    }
                    return (
                      <span key={tag + Math.random()}>
                        {tag}&nbsp;{">"}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
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
