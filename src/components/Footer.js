import styles from "../styles/components/footer.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__signature}>
        <Link href="/">
          <p>Copyright &copy; 2020 LocalMerch</p>
        </Link>
      </div>
      <div className={styles.footer__links}>
        <Link href="/">
          <p>About</p>
        </Link>
        <Link href="/">
          <p>Contact</p>
        </Link>
        <Link href="/">
          <p>Faqs</p>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
