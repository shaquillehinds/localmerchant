import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ProductSearchContext } from "../pages/product";
import styles from "../styles/components/category-search.module.scss";
import form from "../styles/components/form.module.scss";

const CategorySearch = () => {
  const router = useRouter();
  const { state } = useContext(ProductSearchContext);
  const [parent, setParent] = useState({ parent: "" });
  useEffect(() => {
    // console.log(state.sub, state.query, state.parent);
    if (state.parent) {
      setParent({ parent: state.parent[state.parent.length - 1] });
    } else {
      setParent({ parent: undefined });
    }
  }, [state.query, state.parent]);
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    router.push(`/product?category=${encodeURIComponent(category)}`);
    e.target.value = "More Categories";
  };
  return (
    <div>
      <div className={styles.category_search_wrapper}>
        {parent.parent ? (
          <div className={styles.category_search_parent}>
            <Link href={`/product?category=${encodeURIComponent(parent.parent)}`}>
              <a>
                {"<"} {parent.parent}{" "}
              </a>
            </Link>
          </div>
        ) : state.key === "search" ? (
          <div className={styles.product_search_page_main}>
            <a style={{ fontSize: "var(--font-m)" }}>No Categories Found For Searched Product</a>
          </div>
        ) : null}
        <div className={styles.category_search_current}>
          {state.key === "category" ? <h1>{state.query}</h1> : <h2>Searched for: {state.query}</h2>}
        </div>
        <div>
          {state.mobile && state.sub.length > 0 ? (
            <div className={styles.category_search_select}>
              <select
                // onBlur={(e) => (e.target.size = 1)}
                // onFocus={(e) => (e.target.size = 5)}
                className={form.form_select}
                defaultValue={"More Categories"}
                onChange={handleCategoryChange}
              >
                <option
                  className={form.form_option}
                  disabled
                  key="More Categories"
                  value={"More Categories"}
                >
                  More Categories
                </option>
                {state.sub.map((cat) => {
                  return (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <div className={styles.category_search_sub}>
              {state.sub.map((cat) => {
                return (
                  <p className={styles.category_search_sub_item} key={cat}>
                    {" - "}
                    <Link href={`/product?category=${encodeURIComponent(cat)}`}>
                      {state.current === cat ? (
                        <a className={styles.category_search_sub_item_current}>{cat}</a>
                      ) : (
                        <a>{cat}</a>
                      )}
                    </Link>
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySearch;
