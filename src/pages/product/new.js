import styles from "../../styles/components/form.module.scss";
import font from "../../styles/components/elements/fonts.module.scss";
import loaders from "../../styles/components/elements/loaders.module.scss";
import page from "../../styles/components/elements/page.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import button from "../../styles/components/elements/button.module.scss";
import Link from "next/link";
import numeral from "numeral";
import { inputValidate } from "../../functions/formValidation";
import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "browser-cookies";
import SelectCategory from "../../components/SelectCategory";

const New = () => {
  const [state, setState] = useState({
    name: "",
    price: "",
    tags: [],
    images: [],
    description: "",
    loading: false,
    customer: false,
    selectCategoryState: undefined,
  });
  useEffect(() => {
    const customer = cookies.get("customer");
    if (customer === "yes") {
      location.href = "/";
    }
  }, []);
  const tagsHandler = (value) => {
    if (value.length > 2) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 2);
    } else {
      return [];
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
    const tags = tagsHandler(e.target.elements.tags.value);
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
    formData.append("tags", JSON.stringify([...state.tags, ...tags]));
    formData.append("description", state.description);
    state.images.forEach((image) => formData.append("image", image));
    setState((prev) => ({ ...prev, loading: true }));
    const data = await axios({
      method: "post",
      url: "/api/product",
      data: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setState((prev) => ({ ...prev, loading: false }));
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
  const goBackHandler = (e) => {
    setState((prev) => ({ ...prev, tags: [] }));
  };
  const saveCategoryHandler = () => {
    state.selectCategoryState.savedCategories.push({
      name: state.tags[state.tags.length - 1],
      category: state.tags,
    });
    // const updates = { categories: { name: state.tags[state.tags.length - 1], category: state.tags } };
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
        <form onSubmit={onSubmitHandler} className={styles.form_wide}>
          <input
            type="text"
            autoFocus
            className={styles.form_input}
            placeholder="Product Name"
            required
            value={state.name}
            onChange={nameHandler}
          />
          <span className={styles.form_input_wrapper}>
            <input
              type="text"
              onChange={onPriceChange}
              className={styles.form_input_narrow}
              required
              value={state.price}
              placeholder="Price"
            />
          </span>
          <span className={styles.form_input_wrapper}>
            <span className={font.text_m}>Images</span>
            <label htmlFor="upload" className={styles.form_input_upload_label}>
              <input
                type="file"
                onChange={fileHandler}
                required
                id="upload"
                accept="image/png, .jpeg, .jpg"
                multiple
                className={styles.form_input_upload}
                placeholder="Price"
              />
              <span className={styles.form_input_upload_button}>Select</span>
            </label>

            <span className={font.text_m_grey}>6 Max</span>
          </span>

          <input
            type="text"
            name="tags"
            placeholder="Tags (E.g headphones, earbuds) 10 Max"
            className={styles.form_input}
          />
          <input
            type="text"
            placeholder="Descripton"
            className={styles.form_input}
            onChange={descriptionHandler}
            value={state.description}
          />
          <button className={button.btn_primary}>Add</button>
          <Link href="/">
            <button className={button.btn_link}>Cancel</button>
          </Link>
        </form>
      )}

      <Footer />
    </div>
  );
};
export default New;
