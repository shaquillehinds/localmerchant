import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ProductSearchContext } from "../pages/product";
import styles from "../styles/components/category-search.module.scss";
import form from "../styles/components/form.module.scss";

const CategorySearch = () => {
  const router = useRouter();
  const { state } = useContext(ProductSearchContext);
  useEffect(() => {
    console.log(state.sub, state.query, state.parent);
  }, [state.query]);
  return (
    <div>
      <div className={styles.category_search_wrapper}>
        <div className={styles.category_search_parent}>
          <h2>
            {" "}
            {"<"} {state.parent[state.parent.length - 1]}{" "}
          </h2>
        </div>
        <div className={styles.category_search_current}>
          <h1>{state.query}</h1>
        </div>
        <div>
          {state.mobile ? (
            <div className={styles.category_search_select}>
              <select
                // onBlur={(e) => (e.target.size = 1)}
                // onFocus={(e) => (e.target.size = 5)}
                className={form.form_select}
                defaultValue={"More Categories"}
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
                    {" "}
                    - {cat}
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
