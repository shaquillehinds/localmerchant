import { useState, useEffect } from "react";
import { graphqlFetch } from "../../functions/api";
import ImageSlide from "../../components/ImageSlide";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/pages/product-page.module.scss";
import btn from "../../styles/components/elements/button.module.scss";
import numeral from "numeral";

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
      <div className={styles.product_wrapper}>
        <div className={styles.product_chain}>Electronics &gt; Audio &gt; Headphones</div>
        <div className={styles.product_images}>
          {state.product.images ? <ImageSlide images={state.product.images} /> : null}
        </div>
        <div className={styles.product_info}>
          <div className={styles.product_info_name}>{state.product.name}</div>

          {state.product.inStock ? (
            <div className={styles.product_info_instock}>In Stock</div>
          ) : (
            <div className={styles.product_info_outofstock}>Out of Stock</div>
          )}

          <div className={styles.product_info_details}>
            <div className={styles.product_info_details_price}>
              <p className={styles.product_info_details_title}>Price</p>
              {numeral(state.product.price / 100).format("$0,0[.]00")}
            </div>
            <div className={styles.product_info_details_store}>
              <p className={styles.product_info_details_title}>Store</p>
              {state.product.store.storeName}
            </div>
            <div className={styles.product_info_details_description}>
              <p className={styles.product_info_details_title}>Description</p>
              {state.product.description}
            </div>
            <div className={styles.product_info_details_buttons}>
              <button className={btn.btn_large_primary}>Wishlist</button>
              <button className={btn.btn_large_primary}>Message Store</button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.related_products}>Related Products</div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}

export default ProductPage;
