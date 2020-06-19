import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchProducts, graphqlFetch } from "../functions/api";
import ProductCard from "../components/ProductCard";
import transformNumber from "../functions/numberTransformer";
import Qs from "qs";

const CATEGORIES_QUERY = (level, category) => {
  return `query{
      categories (level: "${level}", category: "${category}"){
        subCategories
      }
    }`;
};
const ALL_CATEGORIES_QUERY = `
  query{
    categories (category: "category"){
      all
    }
  }
`;

const Product = () => {
  const [state, setState] = useState({ products: [], query: "", key: "" });
  const router = useRouter();
  useEffect(() => {
    const initTimestamp = new Date().getTime();
    const categoryWorker = new Worker("./workers/categoryWorker.js");
    (async () => {
      const products = await searchProducts();
      const queryString = window.location.search || window.location.category;
      const { search, category, level } = Qs.parse(queryString, { ignoreQueryPrefix: true });
      let key;
      const query = search || category;
      search ? (key = "search") : (key = "category");
      if (!query) {
        router.push("/");
      }
      setState((prev) => ({ ...prev, products, query, key }));
      /************************** Level Finder ******************************/
      const levels = localStorage.getItem("levels");
      if (!levels) {
        try {
          const all = (await graphqlFetch(ALL_CATEGORIES_QUERY)).categories.all;
          all.forEach((level, index) => {
            localStorage.setItem(`level${index + 1}`, JSON.stringify(level.categories));
          });
          localStorage.setItem("levels", "yes");
        } catch (e) {
          console.log(e);
        }
      }
      if (key === "category" && !level) {
        const allLevels = [];
        for (let i = 1; i <= 6; i++) {
          allLevels.push(JSON.parse(localStorage.getItem(`level${i}`)));
        }
        categoryWorker.addEventListener("message", (e) => {
          const { currentLevel, sub } = e.data;
          const finishTimestamp = new Date().getTime();
          console.log(`time: ${finishTimestamp - initTimestamp}`);
          console.log(currentLevel, sub);
        });
        categoryWorker.postMessage({ category: query, allLevels });
      }
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
