import font from "../../../styles/components/elements/fonts.module.scss";
import loaders from "../../../styles/components/elements/loaders.module.scss";
import button from "../../../styles/components/elements/button.module.scss";
import page from "../../../styles/components/elements/page.module.scss";
import form from "../../../styles/components/form.module.scss";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductForm from "../../../components/ProductForm";
import { inputValidate } from "../../../functions/formValidation";
import { graphqlFetch } from "../../../functions/api";
import axios from "axios";
import cookies from "browser-cookies";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect, createContext } from "react";

const PRODUCT_INFO_QUERY = (id) => `
  query{
    product (id: "${id}") {
      name
      price
      tags
      description
      inStock
      images
    }
  }
`;

export const EditProductContext = createContext(null);
const edit = ({ id }) => {
  const router = useRouter();
  const [state, setState] = useState({
    id: "",
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
    updated: false,
  });
  useEffect(() => {
    const customer = cookies.get("customer");
    const loggedIn = cookies.get("loggedIn");
    if (customer === "yes" || loggedIn === "no") {
      location.href = "/";
    }
    (async () => {
      const product = (await graphqlFetch(PRODUCT_INFO_QUERY(id))).product;
      const attributeTags = product.tags.filter(
        (tag, index, thisArray) => index > thisArray.indexOf(product.name)
      );
      const tags = product.tags.filter(
        (tag, index, thisArray) => index < thisArray.indexOf(product.name)
      );
      setState((prev) => ({ ...prev, ...product, attributeTags, tags, price: product.price / 100 }));
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
      inputValidate(e.target, attributeTags.length > 1);
    } else {
      setState((prev) => ({ ...prev, attributeTags: [] }));
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const submitButton = e.target.elements.submitButton;
    const tags = state.attributeTags;
    if (state.name.length < 3) {
      return alert("Enter A Valid Name");
    } else if (state.description && state.description.length < 3) {
      return alert("Enter A Valid Description");
    } else if (tags.length > 10) {
      return alert("Reduce Tags To 10 Or Less");
    }
    submitButton.disabled = true;
    const priceInCents = parseFloat(state.price) * 100;
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("price", priceInCents);
    formData.append("tags", JSON.stringify([...state.tags, state.name, ...tags]));
    formData.append("description", state.description);
    formData.append("inStock", state.inStock);
    formData.append("images", JSON.stringify(state.images));
    setState((prev) => ({ ...prev, loading: true }));
    const data = await axios({
      method: "patch",
      url: `/api/product/${id}`,
      data: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setState((prev) => ({ ...prev, loading: false, updated: true }));
    submitButton.disabled = false;
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
      const images = [];
      for (let file in e.target.files) {
        images.push(e.target.files[file]);
      }
      images.pop();
      images.pop();
      setState((prev) => ({ ...prev, images }));
    }
  };
  const imageSelectHandler = (image) => {
    const images = state.images.filter((img) => img !== image);
    images.unshift(image);
    setState((prev) => ({ ...prev, images }));
  };
  const descriptionHandler = (e) => {
    const description = e.target.value;
    inputValidate(e.target, e.target.value.length > 2);
    setState((prev) => ({ ...prev, description }));
  };
  const inStockHandler = (e) => {
    console.log("instock");
    setState((prev) => ({ ...prev, inStock: true }));
  };
  const outOfStockHandler = (e) => {
    setState((prev) => ({ ...prev, inStock: false }));
  };
  const deleteHandler = async (e) => {
    await axios({
      method: "delete",
      url: `/api/product/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    console.log("delete");
    router.push("/store/account/products");
  };
  return (
    <div>
      <Header />
      {state.loading ? (
        <div className={page.setup}>
          <div className={loaders.ring__loader}></div>
        </div>
      ) : state.updated ? (
        <div className={page.setup}>
          <div className={form.form_wide} style={{ maxHeight: "30rem" }}>
            <h5 className={font.heading_text} style={{ textAlign: "center" }}>
              Product Updated
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
                onClick={() => setState((prev) => ({ ...prev, updated: false }))}
              >
                Edit Again
              </button>
              <Link href="/store/account/products">
                <button className={button.btn_primary}>To Products</button>
              </Link>
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className={font.heading_container}>
            <h1 className={font.heading_text_normal} style={{ marginBottom: 0 }}>
              Edit Product
            </h1>
          </div>
          <EditProductContext.Provider value={{ state }}>
            <ProductForm
              descriptionHandler={descriptionHandler}
              onPriceChange={onPriceChange}
              fileHandler={fileHandler}
              descriptionHandler={descriptionHandler}
              nameHandler={nameHandler}
              onSubmitHandler={onSubmitHandler}
              attributesHandler={attributesHandler}
              inStockHandler={inStockHandler}
              outOfStockHandler={outOfStockHandler}
              handleDelete={deleteHandler}
              imageSelectHandler={imageSelectHandler}
              edit={true}
            />
          </EditProductContext.Provider>
        </div>
      )}
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}

export default edit;
