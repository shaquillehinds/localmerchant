import Link from "next/link";
import SearchBar from "./elements/SearchBar";
import Hamburger from "./elements/Hambuger";
import styles from "../styles/components/header.module.scss";

const Header = () => (
  <div className={styles.header}>
    <div className={styles.header__left}>
      <Hamburger />
    </div>
    <div className={styles.header__mid}>
      <h1 className={styles.header__title}>LOCVLMERCH</h1>
      <SearchBar />
    </div>
    <div className={styles.header__right}></div>

    {/* <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/about">
      <a>About</a>
    </Link> */}
  </div>
);

export default Header;
