import styles from "../styles/components/display-item.module.scss";
const DisplayItem = ({ img, text, storeName }) => {
  return (
    <div className={styles.display_item}>
      <div className={styles.display_item__image}>
        {storeName ? (
          <div
            data-store={storeName}
            className={styles.display_item__overlay}
          ></div>
        ) : null}
        <img src={img}></img>
      </div>
      <div className={styles.display_item__text}>
        <p>{text}</p>
      </div>
    </div>
  );
};
export default DisplayItem;
