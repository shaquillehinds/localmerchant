import Header from "../components/Header";
import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import { searchProducts, graphqlFetch } from "../functions/api";
import ProductCard from "../components/ProductCard";
import transformNumber from "../functions/numberTransformer";
import Qs from "qs";
import CategorySearch from "../components/CategorySearch";
import styles from "../styles/pages/product-search-page.module.scss";

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
      main
    }
  }
`;

export const ProductSearchContext = createContext(null);

const Product = () => {
  const [state, setState] = useState({
    products: [],
    query: "",
    key: "",
    parent: [],
    sub: [],
    mobile: false,
  });
  const router = useRouter();
  useEffect(() => {
    const initTimestamp = new Date().getTime();
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
      let mobile;
      window.innerWidth < 700 ? (mobile = true) : (mobile = false);
      setState((prev) => ({ ...prev, products, query, key, mobile }));

      /************************** Level Finder ******************************/
      const levels = localStorage.getItem("levels");
      if (!levels) {
        try {
          const all = (await graphqlFetch(ALL_CATEGORIES_QUERY)).categories.main;
          localStorage.setItem("allLevels", JSON.stringify(all));
          localStorage.setItem("levels", "yes");
        } catch (e) {
          console.log(e);
        }
      }
      if (key === "category" && !level) {
        const categoryWorker = new Worker("./workers/categoryWorker.js");
        categoryWorker.addEventListener("message", (e) => {
          const { currentLevel, sub, parent } = e.data;
          const finishTimestamp = new Date().getTime();
          console.log(`time: ${finishTimestamp - initTimestamp}`);
          setState((prev) => ({ ...prev, sub, parent }));
          // console.log(currentLevel, sub, parent);
        });
        categoryWorker.postMessage({
          category: query,
          all: JSON.parse(localStorage.getItem("allLevels")),
        });
      }
      if (key === "search") {
        let tags;
        products[0] ? (tags = products[0].tags) : null;
        if (tags) {
          const searchWorker = new Worker("./workers/searchWorker.js");
          let activated = false;
          searchWorker.addEventListener("message", (e) => {
            const { parent, sub } = e.data;
            console.log(sub, parent);
            const finishTimestamp = new Date().getTime();
            console.log(`time: ${finishTimestamp - initTimestamp}`);
          });
          tags.forEach((tag, index, thisArray) => {
            if (tag.toLowerCase() === search.toLowerCase() && !activated) {
              searchWorker.postMessage({
                parent: thisArray[index - 2],
                parentLevel: transformNumber(index - 1),
                all: JSON.parse(localStorage.getItem("allLevels")),
              });
              activated = true;
            }
          });
        }
      }
    })();
  }, [router.query]);
  return (
    <div>
      <Header />

      {/* {router.query.search || router.query.category ? (
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
      ) : null} */}

      <div className={styles.product_search_page_wrapper}>
        <ProductSearchContext.Provider value={{ state }}>
          {state.key === "category" ? <CategorySearch /> : null}
        </ProductSearchContext.Provider>
        <div className={styles.product_search_page_products}>
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
      </div>
    </div>
  );
};

export default Product;
