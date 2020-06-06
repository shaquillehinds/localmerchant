const jwt = require("jsonwebtoken");
const Chat = require("../api/models/ChatModel");
const Store = require("../api/models/StoreModel");
const Customer = require("../api/models/CustomerModel");

const connect = async (socket, io) => {
  //create function to send status
  sendStatus = (s) => {
    socket.emit("status", s);
  };

  // check to see if customer is logged in by getting their JWT token and verifying
  if (socket.handshake.headers.token) {
    var tokenID = jwt.verify(socket.handshake.headers.token, process.env.JWT_SECRET)._id;
    if (!tokenID) {
      sendStatus("Unverified User, Please Sign In. Disconnected");
      return socket.disconnect();
    }
  }

  if (socket.handshake.query.store) {
    //finds the store they want to communicate with
    const storeDoc = await Store.findOne({
      businessURL: socket.handshake.query.store,
    });
    //Get the store id if it exists
    if (storeDoc) {
      var store = storeDoc._id;
    }
  } else if (socket.handshake.query.customer) {
    //finds the customer the store wants to communicate with
    const clientDoc = await Customer.findOne({
      userName: socket.handshake.query.customer,
    });
    //Get the customer id if it exist
    if (clientDoc) {
      var customer = clientDoc._id;
    }
  }

  if (!store && !customer) {
    // if no store or customer, then send status and disconnect
    sendStatus("The store or customer you're looking for doesn't exist. Disconnected");
    return socket.disconnect();
  } else if (!store) {
    //if query was not store then signed in person is store
    var store = tokenID;
    const exists = await Store.findById(store);
    if (!exists) {
      sendStatus("Invalid Request. Only a store can message a customer. Disconnected");
      return socket.disconnect();
    }
    socket.emit("Name", exists.businessName);
  } else if (!customer) {
    // if query was not customer then signed in person is customer
    var customer = tokenID;
    const exists = await Customer.findById(customer);
    if (!exists) {
      sendStatus("Invalid Request. Only a customer can message a store. Disconnected");
      return socket.disconnect();
    }
    socket.emit("Name", exists.firstName);
  }

  //Get the previous messages if they exists
  let chat = await Chat.findOne({ customer, store }, { messages: { $slice: -100 } });

  //if this is a new chat then create new docment in chat collection
  if (!chat && customer) {
    chat = new Chat({ customer, store, messages: [] });
  }
  //create room from chat id and then join
  const room = chat._id;
  socket.join(room);

  sendStatus("Connection established");
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
      // add message to document
      chat.messages.push(`${name}: ${message}`);
      //save document to collection
      chat.save();
      //send message to room
      io.to(room).emit("message", { name, message });
      sendStatus({ message: "Message sent", clear: true });
    }
  });
};

module.exports = connect;
