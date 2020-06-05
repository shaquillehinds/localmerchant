const { app, server } = require("../api/app");
const socketIO = require("socket.io");
const Chat = require("../api/models/ChatModel");

const io = socketIO(server);

app.get("/message", async (req, res) => {
  const userID = req.query.userid;
  const otherID = req.query.otherid;

  const chat = await Chat.findOne({ customer, store }, { messages: { $slice: -100 } });

  // connect to Socket.io
  io.on("connection", (socket) => {
    const customer = socket.handshake.query.customer;
    const store = socket.handshake.query.store;

    //create function to send status
    sendStatus = (s) => {
      socket.emit("status", s);
    };

    //get chats from Chat collection
    Chat.findOne({ customer, store }, { messages: 1 })
      .then((res) => io.emit("messages", res.messages))
      .catch((err) => console.log(err));

    const chat = Chat.findOne({ customer, store });
    // handle input events
    socket.on("message", ({ name, message }) => {
      //check for name and message
      if (name == "" || message == "") {
        // Send error status
        sendStatus("Please enter a name and message");
      } else {
        // add message to collection
      }
    });
  });
});

module.exports = app;
