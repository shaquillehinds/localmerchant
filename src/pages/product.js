import Header from "../components/Header";
import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import { searchProducts, graphqlFetch } from "../functions/api";
import setCategories from "../functions/setCategories";
import ProductCard from "../components/ProductCard";
import transformNumber from "../functions/numberTransformer";
import Qs from "qs";
import CategorySearch from "../components/CategorySearch";
import FilterSort from "../components/FilterSort";
import styles from "../styles/pages/product-search-page.module.scss";

const CATEGORIES_QUERY = (level, category) => {
  return `query{
      categories (level: "${level}", category: "${category}"){
        subCategories
      }
    }`;
};

export const ProductSearchContext = createContext(null);

const Product = () => {
  const [state, setState] = useState({
    products: [],
    query: "",
    key: "",
    parent: [],
    current: "",
    sub: [],
    page: 0,
    mobile: false,
  });
  const router = useRouter();
  useEffect(() => {
    let tail = true;
    (async () => {
      const products = await searchProducts(state.page);
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
          await setCategories();
        } catch (e) {
          console.log(e);
        }
      }

      if (key === "category" && !level) {
        const categoryWorker = new Worker("./workers/categoryWorker.js");
        const categoryTailWorker = new Worker("./workers/categoryTailWorker.js");
        categoryWorker.addEventListener("message", (e) => {
          const { currentLevel, sub, parent } = e.data;
          const finishTimestamp = new Date().getTime();
          console.log(`category time: ${finishTimestamp - initTimestamp}`);
          setState((prev) => ({ ...prev, sub, parent, current: "" }));
          tail = false;
        });
        categoryTailWorker.addEventListener("message", (e) => {
          const { parent } = e.data;
          const finishTimestamp = new Date().getTime();
          console.log(`tail time: ${finishTimestamp - initTimestamp}`);
          if (tail) setState((prev) => ({ ...prev, parent, sub: [] }));
        });
        let initTimestamp = new Date().getTime();
        categoryWorker.postMessage({
          category: query,
          all: JSON.parse(localStorage.getItem("allLevels")),
        });
        categoryTailWorker.postMessage({
          category: query,
          tails: JSON.parse(localStorage.getItem("tails")),
        });
      }
      if (key === "search") {
        setState((prev) => ({ ...prev, parent: [], sub: [], current: "" }));
        let tags;
        products[0] ? (tags = products[0].tags) : null;
        if (tags) {
          const searchWorker = new Worker("./workers/searchWorker.js");
          let activated = false;
          searchWorker.addEventListener("message", (e) => {
            const { parent, sub, current } = e.data;
            const finishTimestamp = new Date().getTime();
            console.log(`search time: ${finishTimestamp - initTimestamp}`);
            setState((prev) => ({ ...prev, parent, sub, current }));
          });
          let initTimestamp = new Date().getTime();
          tags.forEach((tag, index, thisArray) => {
            if (!activated && tag.toLowerCase() === search.toLowerCase()) {
              searchWorker.postMessage({
                parent: thisArray[index - 2],
                parentLevel: transformNumber(index - 1),
                current: thisArray[index - 1],
                all: JSON.parse(localStorage.getItem("allLevels")),
              });
              activated = true;
            } else if (!activated && index === thisArray.length - 1) {
              searchWorker.postMessage({
                parent: tags[1],
                parentLevel: "two",
                all: JSON.parse(localStorage.getItem("allLevels")),
              });
            }
          });
        }
      }
    })();
  }, [router.query]);

  const handleFilterSort = async (filter, sort) => {
    const products = await searchProducts(state.page, filter, sort);
    setState((prev) => ({ ...prev, products }));
  };

  return (
    <div>
      <Header />

      <div className={styles.product_search_page_wrapper}>
        <ProductSearchContext.Provider value={{ state }}>
          <CategorySearch />
        </ProductSearchContext.Provider>
        <div className={styles.product_search_page_main}>
          <div className={styles.product_search_page_heading_wrapper}>
            <div className={styles.product_search_page_heading}>
              {state.key === "category" ? (
                <h1>{state.query}</h1>
              ) : (
                <div>
                  Searched for: <h2>{state.query}</h2>
                </div>
              )}
            </div>
            <ProductSearchContext.Provider value={{ providerState: state }}>
              <FilterSort handleFilterSort={handleFilterSort} />
            </ProductSearchContext.Provider>
          </div>
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
    </div>
  );
};

export default Product;
