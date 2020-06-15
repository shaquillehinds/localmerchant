import DisplayItem from "./DisplayItem";
import styles from "../styles/components/horizontal-showcase.module.scss";
import numeral from "numeral";

const HorizontalShowcase = ({ displayItems }) => {
  return (
    <div className={styles.horizontal_showcase}>
      {displayItems.map((item) => (
        <div
          key={item._id ? item._id + `${Math.random()}` : Math.random()}
          className={styles.horizontal_showcase__item_wrapper}
        >
          <DisplayItem
            img={item.image}
            text={
              item.price
                ? `${numeral(item.price / 100).format("$0,0[.]00")}`
                : item.storeName
                ? `View Store`
                : "Unknown"
            }
            storeName={item.storeName ? item.storeName : undefined}
            id={item._id}
            storeURL={item.storeURL}
          />
          <div className={styles.horizontal_showcase__spacing}></div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalShowcase;
