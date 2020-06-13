import styles from "../styles/components/product-card.module.scss";
export const ProductCard = ({ id, image, name, price, storeName, mode, handleBoost }) => {
  return (
    <div className={styles.product_card_wrapper_private}>
      <div className={styles.product_card_image}>
        <img src={image} />
      </div>
      <div className={styles.product_card_name}>
        <div className={styles.product_card_item}>
          <h5 className={styles.product_card_item_title}>Product Name</h5>
          <p className={styles.product_card_item_name}>{name}</p>
        </div>
      </div>
      <div className={styles.product_card_price}>
        <div className={styles.product_card_item}>
          <h5 className={styles.product_card_item_title}>Price</h5>
          <p className={styles.product_card_item_price}>{"$" + price}</p>
        </div>
      </div>
      <div className={styles.product_card_store}>
        <div className={styles.product_card_item}>
          <h5 className={styles.product_card_item_title}>Store</h5>
          <p className={styles.product_card_item_store}>{storeName}</p>
        </div>
      </div>

      {mode === "private" ? (
        <div className={styles.product_card_edit}>
          <div className={styles.product_card_button_edit}>
            <p>Edit</p>
          </div>
        </div>
      ) : null}

      {mode === "private" ? (
        <div className={styles.product_card_boost}>
          <div onClick={(e) => handleBoost(e)} data-id={id} className={styles.product_card_button_boost}>
            <p>Boost</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductCard;
