const searchProducts = async (searchBy) => {
  const search = window.location.search;
  try {
    const res = await fetch(`api/${searchBy}${search}`);
    const products = await res.json();
    return products;
  } catch (e) {
    console.error(e);
  }
};

export { searchProducts };
