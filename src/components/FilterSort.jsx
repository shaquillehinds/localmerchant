import React from "react";
import form from "../styles/components/form.module.scss";
import styles from "../styles/components/filter-sort.module.scss";
const FilterSort = () => {
  return (
    <div className={styles.filter_sort_wrapper}>
      <div>
        {" "}
        <select className={form.form_select} defaultValue={"Filter"}>
          <option value={"Filter"} className={form.form_option}>
            Filter
          </option>
          <option value="All">All</option>
          <option value="Delivery">Delivery</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div>
        <select className={form.form_select} defaultValue={"Sort By"}>
          <option value={"Sort By"} className={form.form_option}>
            Sort By
          </option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Price (High)">Price (High)</option>
          <option value="Price (Low)">Price (Low)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSort;
