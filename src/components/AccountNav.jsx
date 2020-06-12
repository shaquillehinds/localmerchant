import styles from "../styles/components/account-nav.module.scss";
import Link from "next/link";
const AccountNav = ({ accountType, active }) => {
  return (
    <ul className={styles.account_nav_wrapper}>
      <li className={styles.account_nav_item}>
        <Link href={`/${accountType}/account`}>
          <a className={active === "account" ? styles.account_nav_link_active : styles.account_nav_link}>
            Account
          </a>
        </Link>
      </li>
      {accountType === "customer" ? (
        <li className={styles.account_nav_item}>
          <Link href={`/${accountType}/account/wishlist`}>
            <a
              className={
                active === "wishlist" ? styles.account_nav_link_active : styles.account_nav_link
              }
            >
              Products
            </a>
          </Link>
        </li>
      ) : (
        <li className={styles.account_nav_item}>
          <Link href={`/${accountType}/account/products`}>
            <a
              className={
                active === "products" ? styles.account_nav_link_active : styles.account_nav_link
              }
            >
              Products
            </a>
          </Link>
        </li>
      )}
      <li className={styles.account_nav_item}>
        <Link href={`/${accountType}/account/messages`}>
          <a
            className={active === "messages" ? styles.account_nav_link_active : styles.account_nav_link}
          >
            Messages
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default AccountNav;
