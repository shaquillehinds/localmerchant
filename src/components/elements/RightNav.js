import styles from "../../styles/components/elements/right-nav.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import cookies from "browser-cookies";

const RightNav = () => {
  const [state, setState] = useState({ loggedIn: false, user: "customer" });
  useEffect(() => {
    if (cookies.get("loggedIn") === "yes") {
      setState((prev) => ({ ...prev, loggedIn: true }));
    }
    if (cookies.get("customer") === "no") {
      setState((prev) => ({ ...prev, user: "store" }));
    }
  }, []);
  return (
    <div className={styles.nav_items__container}>
      {state.loggedIn ? (
        <Link href={`/${state.user}/account`}>
          <a className={styles.nav_items__signup}>Account</a>
        </Link>
      ) : (
        <Link href="/login">
          <a className={styles.nav_items__signup}>Login</a>
        </Link>
      )}
      <Link href={state.loggedIn ? `/${state.user}/account` : "/login"}>
        <svg
          className={styles.nav_items__user}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 57.14"
        >
          <path d="M25,28.57A14.29,14.29,0,1,0,10.71,14.29,14.28,14.28,0,0,0,25,28.57Zm10,3.57H33.14a19.4,19.4,0,0,1-16.28,0H15a15,15,0,0,0-15,15v4.65a5.36,5.36,0,0,0,5.36,5.35H44.64A5.36,5.36,0,0,0,50,51.79V47.14A15,15,0,0,0,35,32.14Z" />
        </svg>
      </Link>
      <div data-wishlist={99} className={styles.nav_items__heart_wrapper}>
        <Link href="/">
          <svg
            className={styles.nav_items__heart}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 43.75"
          >
            <path d="M45.15,3C39.8-1.57,31.84-.75,26.92,4.32L25,6.3l-1.92-2C18.17-.75,10.21-1.57,4.85,3a14,14,0,0,0-1,20.3L22.78,42.81a3.09,3.09,0,0,0,4.43,0L46.1,23.29a14,14,0,0,0-1-20.3Z" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
export default RightNav;
