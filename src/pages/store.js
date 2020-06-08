import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchStores } from "../functions/api";

const Store = () => {
  const [state, setState] = useState({ stores: [] });
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const stores = await searchStores();
      setState((prev) => ({ ...prev, stores }));
    })();
  }, [router.query]);
  return (
    <div>
      <Header />
      {state.stores.map((store) => (
        <div key={store._id}>
          <p>Name: {store.storeName}</p>
          <p>Address: {store.address}</p>
          <p>Phone: {store.phone}</p>
        </div>
      ))}
    </div>
  );
};

export default Store;
