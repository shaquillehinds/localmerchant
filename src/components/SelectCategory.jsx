import { useEffect, useState } from "react";
import form from "../styles/components/form.module.scss";
import styles from "../styles/components/select-category.module.scss";
import page from "../styles/components/elements/page.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import { graphqlFetch } from "../functions/api";
import cookies from "browser-cookies";

const CATEGORIES_QUERY = (tag, level) => {
  if (level && tag) {
    return `
        query{
            categories(level: "${level}", category: "${tag}") {
                subCategories
            }
        }
        `;
  } else if (level) {
    return `query{
          categories(level: "${level}") {
              main
          }
      }`;
  }
};

const SelectCategory = ({ categoryHandler, savedCategories, previousState }) => {
  const [state, setState] = useState({
    levelOne: undefined,
    tagTree: [],
    startingCategories: [],
    level: undefined,
    categories: [],
    history: {},
    savedCategories: [],
    savedUsed: false,
  });
  useEffect(() => {
    if (previousState) {
      if (previousState.savedUsed) {
        return setState((prev) => ({
          history: {},
          level: undefined,
          levelOne: Object.keys(previousState.startingCategories),
          startingCategories: previousState.startingCategories,
          tagTree: [],
          categories: [],
          savedUsed: false,
          savedCategories: previousState.savedCategories,
        }));
      }
      return setState(() => previousState);
    }
    (async () => {
      const customer = cookies.get("customer");
      const loggedIn = cookies.get("loggedIn");
      if (customer === "no" && loggedIn === "yes") {
        const main = (await graphqlFetch(CATEGORIES_QUERY(undefined, "one"))).categories.main;
        setState((prev) => ({
          ...prev,
          levelOne: Object.keys(main),
          startingCategories: main,
          savedCategories,
        }));
      }
    })();
  }, [savedCategories]);
  const getCategories = async (tag, level) => {
    return (await graphqlFetch(CATEGORIES_QUERY(tag, level))).categories.subCategories;
  };
  const previousLevel = async (level) => {
    const tagTree = state.tagTree;
    tagTree.pop();
    if (level === "one") {
      return setState((prev) => ({ ...prev, tagTree, levelOne: prev.history[level], level }));
    }
    setState((prev) => ({ ...prev, tagTree, level, categories: prev.history[level] }));
  };
  const nextLevel = async (tag, level) => {
    const categories = await getCategories(tag, level);
    if (categories.length === 0) {
      setState((prev) => ({
        ...prev,
        level: "last",
        tagTree: [...prev.tagTree, tag],
      }));
      return categoryHandler({ state, tag });
    }
    const history = {};
    history[level] = categories;
    setState((prev) => ({
      ...prev,
      level,
      tagTree: [...prev.tagTree, tag],
      categories,
      history: { ...prev.history, ...history },
    }));
  };
  const handleLevelOne = async (e) => {
    const tag = e.target.innerText;
    if (state.savedUsed) {
      const history = { one: state.startingCategories[tag] };
      return setState((prev) => ({
        ...prev,
        levelOne: prev.startingCategories[tag],
        level: "one",
        tagTree: [tag],
        history,
        savedUsed: false,
      }));
    }

    if (!state.level) {
      const history = { one: state.startingCategories[tag] };
      return setState((prev) => ({
        ...prev,
        levelOne: prev.startingCategories[tag],
        level: "one",
        tagTree: [...prev.tagTree, tag],
        history,
      }));
    }
    const categories = await getCategories(tag, "two");
    if (categories.length === 0) {
      return categoryHandler({ state, tag });
    }
    setState((prev) => ({
      ...prev,
      categories,
      levelOne: undefined,
      level: "two",
      tagTree: [...prev.tagTree, tag],
      history: { ...prev.history, two: categories },
    }));
  };
  const handleCategories = async (e) => {
    const tag = e.target.innerText;
    switch (state.level) {
      case "two":
        return nextLevel(tag, "three");
      case "three":
        return nextLevel(tag, "four");
      case "four":
        return nextLevel(tag, "five");
      case "five":
        return nextLevel(tag, "six");
      case "six":
        return nextLevel(tag, "seven");
      default:
        null;
    }
  };
  const handlePreviousCategory = async (e) => {
    switch (state.level) {
      case "one":
        return setState((prev) => ({
          ...prev,
          level: undefined,
          levelOne: Object.keys(prev.startingCategories),
          tagTree: [],
          categories: [],
        }));
      case "two":
        return previousLevel("one");
      case "three":
        return previousLevel("two");
      case "four":
        return previousLevel("three");
      case "five":
        return previousLevel("four");
      case "six":
        return previousLevel("five");
      default:
        null;
    }
  };
  const handleSavedCategories = (e) => {
    const selection = e.target.value;
    const categories = state.savedCategories.filter((saved) => saved.name === selection);
    if (categories.length > 0) {
      const tagTree = categories[0].category;
      const saveState = { ...state, tagTree, savedUsed: true };
      return categoryHandler({ state: saveState });
    }
  };
  return (
    <div className={page.setup} style={{ padding: 0, justifyContent: "flex-start" }}>
      <h5 className={font.heading_text_m}>Select Category</h5>

      <select
        onChange={handleSavedCategories}
        defaultValue="Saved Categories"
        className={form.form_select}
        style={{ marginBottom: "2rem" }}
      >
        <option value="Saved Categories" className={form.form_input} key="Saved Categories">
          Saved Categories
        </option>
        {state.savedCategories.map((category) => {
          return (
            <option value={category.name} className={form.form_input} key={category.name}>
              {category.name}
            </option>
          );
        })}
      </select>

      {state.tagTree.length > 0 && !state.savedUsed ? (
        <div>
          {state.tagTree.map((tag) => (
            <span
              key={tag}
              className={font.heading_text_s}
              style={{ margin: 0, padding: 0, lineHeight: 2 }}
            >
              {tag}&nbsp; {">"} &nbsp;
            </span>
          ))}
        </div>
      ) : null}
      {state.level ? (
        <p
          onClick={handlePreviousCategory}
          className={font.heading_text_m}
          style={{ cursor: "pointer" }}
        >
          &#8592; Go Back
        </p>
      ) : null}
      {state.levelOne ? (
        <div className={styles.categories_wrapper}>
          {state.levelOne.map((item) => (
            <p
              onClick={handleLevelOne}
              className={form.form_select}
              key={item}
              style={{ marginBottom: "1rem", fontSize: "var(--font-m)", fontWeight: 600 }}
            >
              {item}
            </p>
          ))}
        </div>
      ) : state.categories ? (
        <div className={styles.categories_wrapper}>
          {state.categories.map((item) => (
            <p
              onClick={handleCategories}
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

export default SelectCategory;
