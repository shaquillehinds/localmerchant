import DisplayItem from "./DisplayItem";
import styles from "../styles/components/horizontal-showcase.module.scss";

const HorizontalShowcase = ({ displayItems }) => {
  return (
    <div className={styles.horizontal_showcase}>
      {displayItems.map((item) => (
        <DisplayItem key={item._id} img={item.image} text={item.price} />
      ))}
    </div>
  );
};

export default HorizontalShowcase;
