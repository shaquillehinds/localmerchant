import styles from "../styles/components/category-nav.module.scss";
import { useState } from "react";
const CategoryNav = () => {
  const [state, setState] = useState({
    categories: [
      "Automotive",
      "Art",
      "Beauty & Health",
      "Clothing",
      "Electronics",
      "Home & Garden",
      "Jewelry & Watches",
      "Music & Equipment",
      "Pets & Pet Supplies",
      "Real Estate",
      "Sporting Goods",
    ],
  });
  const closeCategoryNav = () => {
    document.querySelector("#category_nav_wrapper").setAttribute("data-categories", "close");
    document
      .querySelector("#category_nav_wrapper")
      .firstElementChild.setAttribute("data-categories", "close");
  };
  return (
    <div tabIndex={2} id="category_nav_wrapper" className={styles.category_nav_wrapper}>
      <div className={styles.category_nav}>
        <div className={styles.category_nav__title}>
          <h3>Categories</h3>
          <div onClick={closeCategoryNav} className={styles.category_nav__close}>
            X
          </div>
        </div>
        {state.categories.map((category) => (
          <div className={styles.category_nav__category}>
            <h5 className={styles.category_nav__category_name}>{category}</h5>
            <div className={styles.category_nav__category_arrow}>></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryNav;
