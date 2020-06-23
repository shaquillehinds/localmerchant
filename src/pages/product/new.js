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

export const NewProductContext = createContext(null);

const New = () => {
  const router = useRouter();
  const [state, setState] = useState({
    name: "",
    price: "",
    tags: [],
    attributeTags: [],
    images: [],
    description: "",
    loading: false,
    customer: false,
    inStock: true,
    selectCategoryState: undefined,
  });
  useEffect(() => {
    const customer = cookies.get("customer");
    const loggedIn = cookies.get("loggedIn");
    if (customer === "yes" || loggedIn === "no") {
      location.href = "/";
    }
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
      e.target.style.boxShadow = "1px 1px 5px green";
      const images = [];
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
  const inStockHandler = (e) => {
    setState((prev) => ({ ...prev, inStock: true }));
  };
  const outOfStockHandler = (e) => {
    console.log("out of stock");
    setState((prev) => ({ ...prev, inStock: false }));
  };
  const goBackHandler = (e) => {
    setState((prev) => ({ ...prev, tags: [] }));
  };
  const saveCategoryHandler = () => {
    state.selectCategoryState.savedCategories.push({
      name: state.tags[state.tags.length - 1],
      category: state.tags,
    });
    const updates = { categories: state.selectCategoryState.savedCategories };
    axios({
      method: "PATCH",
      url: "/api/store",
      data: { updates },
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
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
      ) : null}
      {state.loading ? (
        <div className={page.setup}>
          <div className={loaders.ring__loader}></div>
        </div>
      ) : state.tags.length === 0 ? (
        <SelectCategory categoryHandler={categoryHandler} previousState={state.selectCategoryState} />
      ) : (
        <NewProductContext.Provider value={{ state }}>
          <ProductForm
            descriptionHandler={descriptionHandler}
            onPriceChange={onPriceChange}
            fileHandler={fileHandler}
            descriptionHandler={descriptionHandler}
            nameHandler={nameHandler}
            onSubmitHandler={onSubmitHandler}
            inStockHandler={inStockHandler}
            outOfStockHandler={outOfStockHandler}
            attributesHandler={attributesHandler}
          />
        </NewProductContext.Provider>
      )}

      <Footer />
    </div>
  );
};
export default New;
