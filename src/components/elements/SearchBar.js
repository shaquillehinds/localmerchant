import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/components/elements/search-bar.module.scss";

export default () => {
  const [state, setState] = useState({ searchBy: "item", results: [], notWaiting: true });
  const router = useRouter();
  const changeSearchMode = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, searchBy: e.target.value }));
  };
  const getSuggestions = async (e) => {
    e.persist();
    if (e.target.value.length < 3) {
      return setState((prev) => ({ ...prev, results: [] }));
    }
    if (state.notWaiting) {
      setState((prev) => ({ ...prev, notWaiting: false }));
      setTimeout(async () => {
        let searchBy;
        state.searchBy === "item" ? (searchBy = "/product") : (searchBy = "/store");
        const res = await fetch(`/api${searchBy}/search?name=${e.target.value}`);
        const matches = await res.json();
        setState((prev) => ({ ...prev, results: matches }));
        setState((prev) => ({ ...prev, notWaiting: true }));
      }, 500);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value;
    if (!searchValue) {
      return null;
    }
    setState((prev) => ({ ...prev, results: [] }));
    let searchBy;
    state.searchBy === "item" ? (searchBy = "/product") : (searchBy = "/store");
    router.push(`${searchBy}?search=${searchValue}`);
    e.target.elements.search.value = "";
  };
  const handleSuggestionClick = (info) => {
    if (info.name) {
      router.push(`/product/${info._id}`);
    } else if (info.businessName) {
      router.push(`/store/${info.businessURL}`);
    } else {
      console.log("error");
    }
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setState((prev) => ({ ...prev, results: [] }));
    }, 100);
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
        <form onSubmit={handleSubmit}>
          <input
            onBlur={handleInputBlur}
            autoComplete="off"
            name="search"
            type="text"
            onChange={getSuggestions}
          ></input>
          <button className={styles.searchBar__icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50.01">
              <path d="M49.32,43.24,39.58,33.5a2.34,2.34,0,0,0-1.66-.69H36.33a20.32,20.32,0,1,0-3.52,3.52v1.59a2.34,2.34,0,0,0,.69,1.66l9.74,9.74a2.33,2.33,0,0,0,3.31,0l2.76-2.76A2.35,2.35,0,0,0,49.32,43.24Zm-29-10.43a12.5,12.5,0,1,1,12.5-12.5A12.49,12.49,0,0,1,20.31,32.81Z" />
            </svg>
          </button>
        </form>
      </div>

      <div className={styles.searchBar__results}>
        {state.results.map((result) => {
          return (
            <div
              onClick={(e) => handleSuggestionClick(result)}
              key={result._id}
              className={styles.searchBar__result}
            >
              {result.name ? result.name : result.businessName}
            </div>
          );
        })}
      </div>
    </div>
  );
};
