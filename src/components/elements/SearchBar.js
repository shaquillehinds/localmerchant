import { useState } from "react";
import styles from "../../styles/components/elements/search-bar.module.scss";

export default () => {
  const [state, setState] = useState({ searchBy: "item", results: [] });
  const changeSearchMode = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, searchBy: e.target.value }));
  };
  const getMatching = async (e) => {
    e.persist();
    if (e.target.value.length < 3) {
      setState((prev) => ({ ...prev, results: [] }));
    } else if (state.searchBy === "item") {
      const res = await fetch(`/api/product/search?name=${e.target.value}`);
      const matches = await res.json();
      setState((prev) => ({ ...prev, results: matches }));
    } else if (state.searchBy === "store") {
      const res = await fetch(`/api/store/search?name=${e.target.value}`);
      const matches = await res.json();
      setState((prev) => ({ ...prev, results: matches }));
    }
  };
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBar__select}>
        <select value={state.searchBy} onChange={changeSearchMode}>
          <option value="item">Item</option>
          <option value="store">Store</option>
        </select>
      </div>
      <div className={styles.searchBar__field}>
        <form>
          <input type="text" onChange={getMatching}></input>
          <button className={styles.searchBar__icon}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              className="svg-inline--fa fa-search fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
            </svg>
          </button>
        </form>
      </div>

      <div className={styles.searchBar__results}>
        {state.results.map((result) => {
          return <div key={result._id}>{result.name}</div>;
        })}
      </div>
    </div>
  );
};
