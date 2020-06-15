import styles from "../styles/components/display-item.module.scss";
import Link from "next/link";
const DisplayItem = ({ img, text, storeName, id, storeURL }) => {
  return (
    <div className={styles.display_item}>
      <Link href={id ? `/product/${id}` : `/store/${storeURL}`}>
        <div className={styles.display_item__image}>
          {storeName ? (
            <div data-store={storeName} className={styles.display_item__overlay}></div>
          ) : null}

          <img src={img}></img>
        </div>
      </Link>
      <Link href={id ? `/product/${id}` : `/store/${storeURL}`}>
        <div className={styles.display_item__text}>
          <p>{text}</p>
        </div>
      </Link>
    </div>
  );
};
export default DisplayItem;
