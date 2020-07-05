import styles from "../styles/components/product-card.module.scss";
import numeral from "numeral";
import Link from "next/link";

export const ProductCard = ({ id, image, name, price, storeName, inStock, mode, handleBoost }) => {
  return (
    <div className={styles.product_card_wrapper_private}>
      <div className={styles.product_card_image}>
        <Link href={`/product/${id}`}>
          <a>
            <img src={image} />
          </a>
        </Link>
      </div>
      <div className={styles.product_card_name}>
        <div className={styles.product_card_item}>
          <h5 className={styles.product_card_item_title}>Product Name</h5>
          <Link href={`/product/${id}`}>
            <a className={styles.product_card_item_name}>{name}</a>
          </Link>
          {inStock ? (
            <p className={styles.product_card_item_instock}>In Stock</p>
          ) : (
            <p className={styles.product_card_item_outofstock}>Out of Stock</p>
          )}
        </div>
      </div>
      <div className={styles.product_card_price}>
        <div className={styles.product_card_item}>
          <h5 className={styles.product_card_item_title}>Price</h5>
          <p className={styles.product_card_item_price}>{numeral(price / 100).format("$0,0[.]00")}</p>
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
          <Link href={`/product/${id}/edit`}>
            <a>
              <div className={styles.product_card_button_edit}>
                <p>Edit</p>
              </div>
            </a>
          </Link>
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
