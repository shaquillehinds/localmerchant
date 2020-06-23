import font from "../../../styles/components/elements/fonts.module.scss";
import loaders from "../../../styles/components/elements/loaders.module.scss";
import button from "../../../styles/components/elements/button.module.scss";
import page from "../../../styles/components/elements/page.module.scss";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductForm from "../../../components/ProductForm";
import { inputValidate } from "../../../functions/formValidation";
import { graphqlFetch } from "../../../functions/api";
import axios from "axios";
import cookies from "browser-cookies";
import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";

const PRODUCT_INFO_QUERY = (id) => `
  query{
    product (id: "${id}") {
      name
      price
      tags
      description
      inStock
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
  });
  useEffect(() => {
    const customer = cookies.get("customer");
    const loggedIn = cookies.get("loggedIn");
    if (customer === "yes" || loggedIn === "no") {
      location.href = "/";
    }
    console.log(id);
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
    } else if (state.images.length > 6) {
      return alert("Only 6 Images Are Allowed");
    } else if (state.description && state.description.length < 3) {
      return alert("Enter A Valid Description");
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
      method: "patch",
      url: `/api/product/${id}`,
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
          edit={true}
        />
      </EditProductContext.Provider>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}

export default edit;
