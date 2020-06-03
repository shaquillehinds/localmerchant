import Link from "next/link";
import { useEffect } from "react";
import SearchBar from "./elements/SearchBar";
import Hamburger from "./elements/Hambuger";
import styles from "../styles/components/header.module.scss";
import RightNav from "../components/elements/RightNav";
import CategoryNav from "../components/CategoryNav";

const Header = () => {
  // useEffect(()=>{

  // },[])
  return (
    <div className={styles.header}>
      <div className={styles.header__left}>
        <Hamburger />
      </div>
      <Link href="/">
        <h1 className={styles.header__title}>LOCVLMERCH</h1>
      </Link>
      <div className={styles.header__mid}>
        <Link href="/">
          <h1 className={styles.header__title_mid}>LOCVLMERCH</h1>
        </Link>
        <SearchBar />
      </div>
      <div className={styles.header__right}>
        <RightNav />
      </div>

      {/* <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/about">
      <a>About</a>
    </Link> */}
      <CategoryNav />
    </div>
  );
};

export default Header;
