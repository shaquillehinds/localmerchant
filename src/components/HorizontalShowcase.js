import DisplayItem from "./DisplayItem";
import styles from "../styles/components/horizontal-showcase.module.scss";

const HorizontalShowcase = ({ displayItems }) => {
  return (
    <div className={styles.horizontal_showcase}>
      {displayItems.map((item) => (
        <div className={styles.horizontal_showcase__item_wrapper}>
          <DisplayItem
            key={item._id + `${Math.random()}`}
            img={item.image}
            text={item.price ? `$${item.price}` : item.businessName ? `View Store` : "Unknown"}
            businessName={item.businessName ? item.businessName : undefined}
          />
          <div className={styles.horizontal_showcase__spacing}></div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalShowcase;
