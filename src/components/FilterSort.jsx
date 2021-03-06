import React from "react";
import form from "../styles/components/form.module.scss";
import styles from "../styles/components/filter-sort.module.scss";
import { useState, useContext, useEffect } from "react";
import { graphqlFetch } from "../functions/api";
import { AccountProductsContext } from "../pages/store/account/products";
import { ProductSearchContext } from "../pages/product";

const PRIVATE_PRODUCTS_QUERY = (tag, store, sort, skip = 0) => `
  query{
    products(tag:"${tag}", store:"${store}", sort: {${sort[0]}:${sort[1]}}, skip: ${skip}){
      _id
      image
      name
      price
      inStock
      store {
        _id
        storeName
        storeURL
      }
    }
  }
`;
const PUBLIC_PRODUCTS_QUERY = (filter, sort, skip = 0) => `
query{
  products(filter:"${filter}", sort: {${sort[0]}:${sort[1]}}, skip: ${skip}){
    _id
    image
    name
    price
    inStock
    store {
      _id
      storeName
      storeURL
    }
  }
}
`;

const FilterSort = ({ mode, handleFilterSort }) => {
  const [state, setState] = useState({
    filter: "",
    sort: ["createdAt", "1"],
    waiting: false,
    store: undefined,
  });
  if (mode === "privateProducts") {
    var { providerState } = useContext(AccountProductsContext);
    if (providerState.products[0]) {
      var storeID = providerState.products[0].store._id;
    }
    var page = providerState.page;
  } else {
    var { providerState } = useContext(ProductSearchContext);
    var page = providerState.page;
  }
  useEffect(() => {
    if (mode === "privateProducts" && providerState.products[0]) {
      setState((prev) => ({ ...prev, store: providerState.products[0].store._id }));
    }
    if (mode === "privateProducts" && state.store) {
      const skip = page * 1;
      (async () => {
        const data = await graphqlFetch(
          PRIVATE_PRODUCTS_QUERY(state.filter, state.store, state.sort, skip)
        );
        if (data) handleFilterSort(data.products);
        else handleFilterSort([]);
      })();
    }
  }, [storeID, page]);
  const handlePrivateProducts = async (e) => {
    if (state.store) {
      const target = e.target;
      const store = state.store;
      if (target.id === "filter") {
        if (!state.waiting) {
          setState((prev) => ({ ...prev, waiting: true }));
          const filterTimeout = setTimeout(async () => {
            const filter = document.querySelector("#filter").value;
            const products = (await graphqlFetch(PRIVATE_PRODUCTS_QUERY(filter, store, state.sort)))
              .products;
            handleFilterSort(products, 0);
            setState((prev) => ({ ...prev, filter, waiting: false }));
            clearTimeout(filterTimeout);
          }, 500);
        }
      } else {
        const sort = target.value.split(":");
        setState((prev) => ({ ...prev, sort }));
        const products = (await graphqlFetch(PRIVATE_PRODUCTS_QUERY(state.filter, store, sort)))
          .products;
        handleFilterSort(products, 0);
      }
    }
  };
  const handlePublicProducts = async (e) => {
    const target = e.target;
    if (target.id === "filter") {
      console.log(e.target.value);
      setState((prev) => ({ ...prev, filter: target.value }));
      handleFilterSort(target.value, state.sort);
    } else {
      const sort = target.value.split(":");
      setState((prev) => ({ ...prev, sort }));
      handleFilterSort(state.filter, sort);
    }
  };
  return (
    <span>
      {mode === "privateProducts" ? (
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <span
              className={form.form_input_wrapper}
              style={{
                padding: 2 + "rem",
                maxWidth: 40 + "rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <input
                className={form.form_input_narrow}
                placeholder="Search Filter"
                type="text"
                name="filter"
                id="filter"
                onChange={handlePrivateProducts}
              />
              <select
                className={form.form_select}
                defaultValue="Sort By"
                onChange={handlePrivateProducts}
              >
                <option className={form.form_option} disabled>
                  Sort By
                </option>
                <option value="createdAt:-1">Newest</option>
                <option value="createdAt:1">Oldest</option>
                <option value="name:1">Name (Asc)</option>
                <option value="name:-1">Name (Des)</option>
              </select>
            </span>
          </form>
        </div>
      ) : (
        <div className={styles.filter_sort_wrapper}>
          <div>
            <select
              id="filter"
              className={form.form_select}
              defaultValue={"Filter"}
              onChange={handlePublicProducts}
            >
              <option disabled value={"Filter"} className={form.form_option}>
                Filter
              </option>
              <option value="">All</option>
              <option value="delivery">Delivery</option>
              <option value="inStock">In Stock</option>
            </select>
          </div>
          <div>
            <select
              className={form.form_select}
              defaultValue={"Sort By"}
              onChange={handlePublicProducts}
            >
              <option disabled value={"Sort By"} className={form.form_option}>
                Sort By
              </option>
              <option value="createdAt:-1">Newest</option>
              <option value="createdAt:1">Oldest</option>
              <option value="price:1">Price (Low)</option>
              <option value="price:-1">Price (High)</option>
            </select>
          </div>
        </div>
      )}
    </span>
  );
};

export default FilterSort;
