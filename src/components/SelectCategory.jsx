import { useEffect, useState } from "react";
import form from "../styles/components/form.module.scss";
import styles from "../styles/components/select-category.module.scss";
import page from "../styles/components/elements/page.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import axios from "axios";

const SelectCategory = ({ categoryHandler }) => {
  const [state, setState] = useState({
    levelOne: undefined,
    tagTree: [],
    startingCategories: [],
    level: undefined,
    categories: [],
  });
  useEffect(() => {
    (async () => {
      const data = await axios({
        url: "/api/product/categories?level=one",
        method: "GET",
      });
      setState((prev) => ({ ...prev, levelOne: Object.keys(data.data), startingCategories: data.data }));
    })();
  }, []);
  const getCategories = async (tag, level) => {
    return await axios({
      url: `/api/product/categories?level=${level}&category=${encodeURIComponent(tag)}`,
      method: "GET",
    });
  };
  const nextLevel = async (tag, level) => {
    const categories = (await getCategories(tag, level)).data;
    if (categories.length === 0) {
      setState((prev) => ({
        ...prev,
        level: "last",
        tagTree: [...prev.tagTree, tag],
      }));
      return categoryHandler([...state.tagTree, tag]);
    }
    setState((prev) => ({
      ...prev,
      level,
      tagTree: [...prev.tagTree, tag],
      categories,
    }));
  };
  const handleLevelOne = async (e) => {
    const tag = e.target.innerText;
    if (!state.level) {
      return setState((prev) => ({
        ...prev,
        levelOne: prev.startingCategories[tag],
        level: "one",
        tagTree: [...prev.tagTree, tag],
      }));
    }
    const categories = (await getCategories(tag, "two")).data;
    if (categories.length === 0) {
      return categoryHandler([...state.tagTree, tag]);
    }
    setState((prev) => ({
      ...prev,
      categories,
      levelOne: undefined,
      level: "two",
      tagTree: [...prev.tagTree, tag],
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
  return (
    <div className={page.setup} style={{ padding: 0, justifyContent: "flex-start" }}>
      <h5 className={font.heading_text}>Select Category</h5>
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
