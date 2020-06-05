import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

const Chat = (props) => {
  //   const router = useRouter();
  //   const [state, setState] = useState({ id: "" });
  useEffect(() => {
    // const { id } = router.query;
    // setState({ id });
    console.log(props.id);
    const socket = io({ path: "/api/chat", query: { store: props.id } });
    socket.on("status", (status) => {
      console.log(status);
    });
  }, []);
  return (
    <div>
      <p>{props.id}</p>
    </div>
  );
};
// export async function getStaticPaths() {
//   return { paths: [{ params: { id: "1" } }], fallback: false };
// }
export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}

export default Chat;
