import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

const Chat = (props) => {
  const [state, setState] = useState({ message: "", socket: undefined, name: "" });

  useEffect(() => {
    console.log(props.id);

    const socket = io({
      path: "/api/chat",
      query: { store: props.id },
      transportOptions: {
        polling: {
          extraHeaders: {
            token: localStorage.getItem("JWT"),
          },
        },
      },
    });

    socket.on("status", (status) => {
      if (status.message) {
        console.log(status.message);
      } else {
        console.log(status);
      }
    });
    socket.on("message", ({ name, message }) => console.log(`${name}: ${message}`));

    socket.on("Name", (name) => {
      setState((prev) => ({ ...prev, name }));
    });

    setState((prev) => ({ ...prev, socket }));
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    state.socket.emit("message", { name: state.name, message: state.message });
    setState((prev) => ({ ...prev, message: "" }));
  };
  const updateMessageState = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, message: e.target.value }));
  };
  return (
    <div>
      <p>{props.id}</p>
      <form onSubmit={sendMessage}>
        <input onChange={updateMessageState} name="message" value={state.message} />
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
