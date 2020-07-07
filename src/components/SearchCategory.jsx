import { useEffect, useState } from "react";
import form from "../styles/components/form.module.scss";
import styles from "../styles/components/select-category.module.scss";
import page from "../styles/components/elements/page.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import setCategories from "../functions/setCategories";

const SearchCategory = (props) => {
  const [state, setState] = useState({ shown: [], results: 0, tails: [] });
  useEffect(() => {
    if (localStorage) {
      const json = localStorage.getItem("tails");
      if (json) {
        const unsorted = Object.keys(JSON.parse(json));
        const tails = [];
        unsorted.forEach((item, index, thisList) => {
          tails.push(item);
          let iterate = index - 1;
          while (iterate >= 0) {
            if (item.length < tails[iterate].length) {
              let swap = tails[iterate];
              tails[iterate] = item;
              tails[iterate + 1] = swap;
            }
            iterate--;
          }
        });
        if (tails) {
          setState((prev) => ({ ...prev, tails }));
        }
      }
    }
  }, []);
  const searchHandler = (e) => {
    const input = e.target.value;
    if (input.length > 2) {
      const re = new RegExp(input, "gi");
      const matches = state.tails.filter((tail) => tail.match(re));
      const results = matches.length;
      const shown = matches.slice(0, 25);
      setState((prev) => ({ ...prev, results, shown }));
    } else {
      setState((prev) => ({ ...prev, results: 0, shown: [] }));
    }
  };
  const categoryClickHandler = async (e) => {
    const tail = e.target.innerText;
    console.log(tail);
    let allJson = localStorage.getItem("allLevels");
    let tailsJson = localStorage.getItem("tails");
    if (!allJson || !tailsJson) {
      let main = await setCategories();
      allJson = main.all;
      tailsJson = main.tails;
    }
    if (allJson && tailsJson) {
      const all = JSON.parse(allJson);
      const tails = JSON.parse(tailsJson);
      const categoryTailWorker = new Worker("/workers/categoryTailWorker.js");
      categoryTailWorker.addEventListener("message", (e) => {
        props.searchCategoryHandler(e.data.categories);
      });
      categoryTailWorker.postMessage({ tails, tail, all });
    }
  };
  return (
    <div className={page.setup} style={{ padding: 0, justifyContent: "flex-start" }}>
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <h1 className={font.heading_text_m}>Find Category</h1>
        <input
          className={form.form_input}
          style={{ marginBottom: "1rem" }}
          type="text"
          onChange={searchHandler}
          placeholder="Type category here... e.g. Chairs"
        />
        <p className={font.text_m}>
          Showing <strong>{state.shown.length}</strong> out of <strong>{state.results}</strong> results
        </p>
      </div>

      {state.shown.length > 0 ? (
        <div className={styles.categories_wrapper}>
          {state.shown.map((item) => (
            <p
              onClick={categoryClickHandler}
              className={form.form_select}
              key={item}
              style={{ marginBottom: "1rem", fontSize: "var(--font-m)", fontWeight: 600 }}
            >
              {item}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SearchCategory;
