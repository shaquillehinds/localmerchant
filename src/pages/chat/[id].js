import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

const Chat = (props) => {
  let socket = io({ path: "/api/chat", query: { store: props.id } });
  const [state, setState] = useState({ message: "" });
  useEffect(() => {
    console.log(props.id);

    socket.on("status", (status) => {
      if (status.message) {
        console.log(status.message);
      } else {
        console.log(status);
      }
    });
    socket.on("message", ({ name, message }) =>
      console.log(`${name}: ${message}`)
    );
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", { name: "Henry", message: state.message });
    setState(() => ({ message: "" }));
  };
  const updateMessageState = (e) => {
    e.persist();
    setState(() => ({ message: e.target.value }));
  };
  return (
    <div>
      <p>{props.id}</p>
      <form onSubmit={sendMessage}>
        <input
          onChange={updateMessageState}
          name="message"
          value={state.message}
        />
        <button>Send</button>
      </form>
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
