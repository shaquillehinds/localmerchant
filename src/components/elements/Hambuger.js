import styles from "../../styles/components/elements/hamburger.module.scss";

export default () => {
  const handleMenu = (e) => {
    e.persist();
    console.log(e.target);
    document.querySelector("#category_nav_wrapper").setAttribute("data-categories", "open");
    document
      .querySelector("#category_nav_wrapper")
      .firstElementChild.setAttribute("data-categories", "open");
  };
  return (
    <div className={styles.hamburger}>
      <div onClick={handleMenu} className={styles.hamburger__wrapper}>
        <div className={styles.hamburger__midLine}></div>
      </div>
    </div>
  );
};
