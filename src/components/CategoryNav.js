import styles from "../styles/components/category-nav.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
const CategoryNav = () => {
  const [state, setState] = useState({
    level: 0,
    initialObject: [],
    categories: [],
  });
  useEffect(() => {
    (async () => {
      const initialObject = (
        await axios({
          url: "/api/product/categories?level=one",
          method: "GET",
        })
      ).data;
      setState((prev) => ({ initialObject, categories: Object.keys(initialObject), level: 1 }));
    })();
  }, []);
  const closeCategoryNav = () => {
    document.querySelector("#category_nav_wrapper").setAttribute("data-categories", "close");
    document
      .querySelector("#category_nav_wrapper")
      .firstElementChild.setAttribute("data-categories", "close");
  };
  const handleCategoryClick = (e) => {
    const selected = e.target.innerText;
    if (state.level === 1) {
      return setState((prev) => ({ ...prev, level: 2, categories: prev.initialObject[selected] }));
    }
  };
  const handleMainMenuClick = () => {
    if (state.level === 2) {
      setState((prev) => ({ ...prev, categories: Object.keys(prev.initialObject), level: 1 }));
    }
  };
  return (
    <div id="category_nav_wrapper" className={styles.category_nav_wrapper}>
      <div className={styles.category_nav}>
        <div onClick={handleMainMenuClick} className={styles.category_nav__title}>
          {state.level === 1 ? (
            <h3>Categories</h3>
          ) : state.level === 2 ? (
            <h3>&#8592; Main Menu</h3>
          ) : null}
          <div onClick={closeCategoryNav} className={styles.category_nav__close}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" />
            </svg>
          </div>
        </div>
        {state.categories.map((category) => (
          <div onClick={handleCategoryClick} key={category} className={styles.category_nav__category}>
            <h5 className={styles.category_nav__category_name}>{category}</h5>
            {state.level === 1 ? (
              <div className={styles.category_nav__category_arrow}>
                <svg viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                </svg>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryNav;
