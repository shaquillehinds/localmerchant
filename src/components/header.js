import Link from "next/link";
const Header = () => (
  <div>
    <h1>LOCVLMERCH</h1>
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/about">
      <a>About</a>
    </Link>
  </div>
);

export default Header;
