import fetch from "isomorphic-unfetch";
import Qs from "qs";

const graphqlRenderedFetch = async (query) => {
  try {
    const JWT = localStorage.getItem("JWT");
    if (JWT) {
      const json = await fetch(`${process.env.APP_URL}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${JWT}` },
        body: JSON.stringify({
          query: query,
        }),
      });
      const res = (await json.json()).data;
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

const graphqlFetch = async (query) => {
  try {
    const json = await fetch(`${process.env.APP_URL}/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
      }),
    });
    const res = (await json.json()).data;
    return res;
  } catch (e) {
    console.log(e);
  }
};

const tagSearchQuery = (search) => `
    query{
      products (tag: "${search}") {
        _id
        name
        image
        inStock
        price
        store {
          storeName
        }
      }
    }
  `;

const searchProducts = async () => {
  const query = window.location.search;
  const { search } = Qs.parse(query, { ignoreQueryPrefix: true });
  console.log(search);
  try {
    return (await graphqlFetch(tagSearchQuery(search)))["products"];
  } catch (e) {
    console.error(e);
  }
};

const storeNameQuery = (search) => `
    query{
      stores (storeName: "${search}") {
        _id
        image
        storeName
        storeURL
        address
        phone
        parish
      }
    }
  `;

const searchStores = async () => {
  const query = window.location.search;
  const { search } = Qs.parse(query, { ignoreQueryPrefix: true });
  try {
    return (await graphqlFetch(storeNameQuery(search)))["stores"];
  } catch (e) {
    console.error(e);
  }
};

export { searchProducts, searchStores, graphqlFetch, graphqlRenderedFetch };
