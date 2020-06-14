import { useState, useEffect } from "react";
import { graphqlFetch } from "../../functions/api";
import ImageSlide from "../../components/ImageSlide";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PRODUCT_QUERY = (id) => `
    query{
        product (id: "${id}"){
            images
            name
            inStock
            price
            description
            store {
                storeName
                storeURL
            }
        }
    }
`;

const ProductPage = ({ id }) => {
  const [state, setState] = useState({ product: {} });
  useEffect(() => {
    console.log(id);
    (async () => {
      const product = (await graphqlFetch(PRODUCT_QUERY(id))).product;
      console.log(product);
      setState((prev) => ({ product }));
    })();
  }, []);
  return (
    <div>
      <Header />
      <div>
        <div>Category Chain</div>
        <div>{state.product.images ? <ImageSlide images={state.product.images} /> : null}</div>
        <div>Product Info</div>
      </div>
      <div>Related Products</div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}

export default ProductPage;
