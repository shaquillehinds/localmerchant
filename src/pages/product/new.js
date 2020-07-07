import font from "../../styles/components/elements/fonts.module.scss";
import loaders from "../../styles/components/elements/loaders.module.scss";
import button from "../../styles/components/elements/button.module.scss";
import page from "../../styles/components/elements/page.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductForm from "../../components/ProductForm";
import { inputValidate } from "../../functions/formValidation";
import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import cookies from "browser-cookies";
import SelectCategory from "../../components/SelectCategory";
import SearchCategory from "../../components/SearchCategory";
import { graphqlRenderedFetch } from "../../functions/api";

export const NewProductContext = createContext(null);

const SAVED_QUERY = `
query{
    store {
        categories {
            name
            category
        }
    }
}`;

const New = () => {
  const router = useRouter();
  const [state, setState] = useState({
    name: "",
    price: "",
    tags: [],
    attributeTags: [],
    images: [],
    description: "",
    added: false,
    loading: false,
    customer: false,
    inStock: true,
    delivery: false,
    selectCategoryState: undefined,
    savedCategories: [],
    searchCategory: false,
  });
  useEffect(() => {
    const customer = cookies.get("customer");
    const loggedIn = cookies.get("loggedIn");
    if (customer === "yes" || loggedIn === "no") {
      location.href = "/";
    }
    (async () => {
      const savedCategories = (await graphqlRenderedFetch(SAVED_QUERY)).store.categories;
      setState((prev) => ({ ...prev, savedCategories }));
    })();
  }, []);
  const attributesHandler = (e) => {
    const value = e.target.value;
    if (value.length > 2) {
      const attributeTags = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 2);
      setState((prev) => ({ ...prev, attributeTags }));
    } else {
      setState((prev) => ({ ...prev, attributeTags: [] }));
    }
  };
  const categoryHandler = ({ state, tag }) => {
    if (tag) {
      return setState((prev) => ({
        ...prev,
        tags: [...state.tagTree, tag],
        selectCategoryState: state,
      }));
    }
    setState((prev) => ({
      ...prev,
      tags: [...state.tagTree],
      selectCategoryState: state,
    }));
  };
  const searchCategoryHandler = (tags) => {
    console.log(tags);
    if (tags) {
      setState((prev) => ({ ...prev, tags, selectCategoryState: "", searchCategory: false }));
    }
  };
  const toggleSearchCategory = () => {
    state.searchCategory
      ? setState((prev) => ({ ...prev, searchCategory: false }))
      : setState((prev) => ({ ...prev, searchCategory: true }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const tags = state.attributeTags;
    if (state.name.length < 3) {
      return alert("Enter A Valid Name");
    } else if (state.images.length > 6) {
      return alert("Only 6 Images Are Allowed");
    } else if (state.description && state.description.length < 3) {
      return alert("Enter A Valid Description");
    } else if (tags.length < 2) {
      return alert("Please Enter At Least 2 Tags");
    } else if (tags.length > 10) {
      return alert("Reduce Tags To 10 Or Less");
    }
    const priceInCents = parseFloat(state.price) * 100;
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("price", priceInCents);
    formData.append("tags", JSON.stringify([...state.tags, state.name, ...tags]));
    formData.append("description", state.description);
    formData.append("inStock", state.inStock);
    formData.append("delivery", state.delivery);
    state.images.forEach((image) => formData.append("image", image));
    setState((prev) => ({ ...prev, loading: true }));
    const data = await axios({
      method: "post",
      url: "/api/product",
      data: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setState((prev) => ({ ...prev, loading: false }));
    router.push("/store/account/products");
  };
  const onPriceChange = (e) => {
    const price = e.target.value;
    if (price.match(/^\d*(\.\d{0,2})?$/)) {
      price ? inputValidate(e.target, true) : null;
      setState((prev) => ({ ...prev, price }));
    }
    if (price.length === 0) {
      inputValidate(e.target, false);
    }
  };
  const nameHandler = (e) => {
    const name = e.target.value;
    inputValidate(e.target, e.target.value.length > 2);
    setState((prev) => ({ ...prev, name }));
  };
  const fileHandler = (e) => {
    if (e.target.files[0]) {
      const images = state.images;
      for (let file in e.target.files) {
        images.push(e.target.files[file]);
      }
      images.pop();
      images.pop();
      setState((prev) => ({ ...prev, images }));
    }
  };
  const descriptionHandler = (e) => {
    const description = e.target.value;
    inputValidate(e.target, e.target.value.length > 2);
    setState((prev) => ({ ...prev, description }));
  };
  const stockHandler = (value) => {
    let inStock;
    value === "inStock" ? (inStock = true) : (inStock = false);
    setState((prev) => ({ ...prev, inStock }));
  };
  const deliveryHandler = (value) => {
    let delivery;
    value === "delivery" ? (delivery = true) : (delivery = false);
    setState((prev) => ({ ...prev, delivery }));
  };
  const goBackHandler = (e) => {
    setState((prev) => ({ ...prev, tags: [] }));
  };
  const saveCategoryHandler = async () => {
    const saved = state.savedCategories.map((item) => item.name);
    if (!saved.includes(state.tags[state.tags.length - 1])) {
      console.log("new");
      const categories = state.savedCategories;
      categories.push({ name: state.tags[state.tags.length - 1], category: state.tags });
      setState((prev) => ({ ...prev, savedCategories: categories }));
      const updates = { categories };
      axios({
        method: "PATCH",
        url: "/api/store",
        data: { updates },
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
    } else {
      console.log("Already Added");
    }
  };
  return (
    <div>
      <Header />
      <div className={font.heading_container}>
        <h1 className={font.heading_text_normal} style={{ marginBottom: "1rem" }}>
          Add Product
        </h1>
      </div>

      {state.tags.length > 0 ? (
        <div>
          {!state.selectCategoryState.savedUsed ? (
            <div className={font.heading_text_m} style={{ textAlign: "center", marginBottom: "1rem" }}>
              <button onClick={saveCategoryHandler} className={button.btn} style={{ fontWeight: 600 }}>
                Save Category
              </button>
            </div>
          ) : null}
          <div
            className={font.heading_container}
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: "1rem" }}
          >
            {state.tags.map((tag) => (
              <span
                key={tag}
                className={font.heading_text_s}
                style={{ margin: 0, padding: 0, lineHeight: 2 }}
              >
                {tag}&nbsp; {">"} &nbsp;
              </span>
            ))}
          </div>
          <p
            onClick={goBackHandler}
            className={font.heading_text_m}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            &#8592; Go Back
          </p>
        </div>
      ) : (
        <div className={font.heading_text_m} style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            onClick={toggleSearchCategory}
            className={button.btn_primary}
            style={{ fontWeight: 600 }}
          >
            {!state.searchCategory ? "Find Category" : "Select Category"}
          </button>
        </div>
      )}
      {state.loading ? (
        <div className={page.setup}>
          <div className={loaders.ring__loader}></div>
        </div>
      ) : state.searchCategory ? (
        <SearchCategory searchCategoryHandler={searchCategoryHandler} />
      ) : state.tags.length === 0 ? (
        <SelectCategory
          savedCategories={state.savedCategories}
          categoryHandler={categoryHandler}
          previousState={state.selectCategoryState}
        />
      ) : state.added ? (
        <div className={page.setup} style={{ paddingTop: "2.5rem" }}>
          <div className={form.form_wide} style={{ maxHeight: "30rem" }}>
            <h5 className={font.heading_text} style={{ textAlign: "center" }}>
              Product Added
            </h5>
            <div style={{ margin: "0 auto" }}>
              <svg
                className={loaders.successAnimation_animated}
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                viewBox="0 0 70 70"
              >
                <path
                  className={loaders.successAnimationResult}
                  fill="#D8D8D8"
                  d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
                />
                <circle
                  className={loaders.successAnimationCircle}
                  cx="35"
                  cy="35"
                  r="24"
                  stroke="#979797"
                  strokeWidth="2"
                  strokeLinecap="round"
                  // fill="transparent"
                />
                <polyline
                  className={loaders.successAnimationCheck}
                  strokeWidth="2"
                  points="23 34 34 43 47 27"
                  fill="transparent"
                />
              </svg>
            </div>
            <span className={form.form_input_wrapper}>
              <button
                className={button.btn}
                onClick={() =>
                  setState({
                    name: "",
                    price: "",
                    tags: [],
                    attributeTags: [],
                    images: [],
                    description: "",
                    added: false,
                    loading: false,
                    customer: false,
                    inStock: true,
                    selectCategoryState: undefined,
                  })
                }
              >
                New Product
              </button>
              <Link href="/store/account/products">
                <button className={button.btn_primary}>To Products</button>
              </Link>
            </span>
          </div>
        </div>
      ) : (
        <NewProductContext.Provider value={{ state }}>
          <ProductForm
            descriptionHandler={descriptionHandler}
            onPriceChange={onPriceChange}
            fileHandler={fileHandler}
            descriptionHandler={descriptionHandler}
            nameHandler={nameHandler}
            onSubmitHandler={onSubmitHandler}
            stockHandler={stockHandler}
            deliveryHandler={deliveryHandler}
            attributesHandler={attributesHandler}
          />
        </NewProductContext.Provider>
      )}

      <Footer />
    </div>
  );
};
export default New;
