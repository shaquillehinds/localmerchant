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

const tagSearchQuery = (key, search) => `
    query{
      products (${key}: "${search}") {
        _id
        name
        image
        inStock
        price
        tags
        store {
          storeName
        }
      }
    }
  `;

const searchProducts = async () => {
  const query = window.location.search || window.location.category;
  const { search, category } = Qs.parse(query, { ignoreQueryPrefix: true });
  const find = search || category;
  let key;
  search ? (key = "tag") : (key = "category");
  try {
    return (await graphqlFetch(tagSearchQuery(key, find)))["products"];
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
