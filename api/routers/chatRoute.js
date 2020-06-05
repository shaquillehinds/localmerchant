const router = require("express").Router();
const { server } = require("../app.js");
const jwt = require("jsonwebtoken");
const { authGraphQL } = require("../middleware/auth");
const socketIO = require("socket.io");
const Chat = require("../models/ChatModel");
const Store = require("../models/StoreModel");

const io = socketIO(server, { path: "/api/chat" });

// connect to Socket.io
module.exports = () => {
  io.on("connection", async (socket) => {
    let customer;
    if (socket.handshake.headers.token) {
      customer = jwt.verify(socket.handshake.headers.token, process.env.JWT_SECRET);
    }
    const collection = await Store.findOne({ businessURL: socket.handshake.query.store });
    let store;
    if (collection) {
      console.log(collection);
      store = collection._id;
    }
    let chat = await Chat.findOne({ customer, store }, { messages: { $slice: -100 } });
    if (!chat && customer) {
      chat = new Chat({ customer, store, messages: [] });
    }
    //create function to send status
    sendStatus = (s) => {
      socket.emit("status", s);
    };
    sendStatus("Connection established");
    console.log("connected");
    if (chat) {
      socket.emit("messages", chat.messages);
    }
    // handle input events
    socket.on("message", ({ name, message }) => {
      //check for name and message
      if (name == "" || message == "") {
        // Send error status
        sendStatus("Please enter a name and message");
      } else {
        // add message to collection
        if (chat) {
          chat.messages.push(`${name}: ${message}`);
        }
        io.emit("message", { name, message });
        sendStatus({ message: "Message sent", clear: true });
      }
    });
    socket.on("clear", (data) => {
      if (chat) {
        chat.messages = [];
      }
      socket.emit("cleared");
    });
  });
};

// router.get("/", authGraphQL, async (req, res) => {
//   let customer;
//   if (req.token) {
//     customer = jwt.verify(req.token, process.env.JWT_SECRET);
//   }
//   const collection = await Store.findOne({ businessURL: req.query.store });

//   let store;
//   if (collection) {
//     console.log(collection);
//     store = collection._id;
//   }

//   if (!store) {
//     return res.status(400).send(`Bad query, please check query ID`);
//   }
//   let chat = await Chat.findOne({ customer, store }, { messages: { $slice: -100 } });

//   if (!chat && customer) {
//     chat = new Chat({ customer, store, messages: [] });
//   }

//   // connect to Socket.io
//   io.on("connection", (socket) => {
//     //create function to send status
//     sendStatus = (s) => {
//       socket.emit("status", s);
//     };
//     sendStatus("Connection established");
//     console.log("connected");
//     if (chat) {
//       socket.emit("messages", chat.messages);
//     }

//     // handle input events
//     socket.on("message", ({ name, message }) => {
//       //check for name and message
//       if (name == "" || message == "") {
//         // Send error status
//         sendStatus("Please enter a name and message");
//       } else {
//         // add message to collection
//         if (chat) {
//           chat.messages.push(`${name}: ${message}`);
//         }
//         io.emit("message", { name, message });
//         sendStatus({ message: "Message sent", clear: true });
//       }
//     });
//     socket.on("clear", (data) => {
//       if (chat) {
//         chat.messages = [];
//       }
//       socket.emit("cleared");
//     });
//   });
//   res.send("Connected");
// });

// module.exports = router;
