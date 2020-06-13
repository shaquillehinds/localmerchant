import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import moment from "moment";
import cookies from "browser-cookies";

const Chat = (props) => {
  const [state, setState] = useState({
    message: "",
    socket: undefined,
    name: "",
    owner: "",
    otherName: "",
  });

  useEffect(() => {
    console.log(props.id);
    const isCustomer = cookies.get("customer");

    const socket = io({
      path: "/api/chat",
      query: isCustomer === "yes" ? { store: props.id } : { customer: props.id },
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
    socket.on("message", ({ createdAt, message }) =>
      console.log(`${message} - ${moment(createdAt).format("h:mm a")}`)
    );

    socket.on("otherName", (otherName) => {
      setState((prev) => ({ ...prev, otherName }));
    });

    socket.on("owner", (owner) => {
      setState((prev) => ({ ...prev, owner }));
    });

    socket.on("messages", (messages) =>
      messages.forEach((message) =>
        console.log(`${message.message} - ${moment(message.createdAt).format("h:mm a")}`)
      )
    );

    socket.on("name", (name) => {
      setState((prev) => ({ ...prev, name }));
    });

    setState((prev) => ({ ...prev, socket }));
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    state.socket.emit("message", { owner: state.owner, message: state.message });
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
