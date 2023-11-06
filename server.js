const app = require("./app");
const connectDatabase = require("./config/db");
const socketio = require("socket.io");

const server = require("http").Server(app);

connectDatabase();

const PORT = process.env.PORT || 5500;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (client) => {
  console.log("Connected to socket.io");
  client.on("send_message", (data) => {
    console.log(data);
    io.sockets.emit("receive_message", data);
  });
});









// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//     //credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   // user have to  connect on personal socket
//   socket.on("setup", (userData) => {
//     // create a room for a particular user
//     socket.join(userData._id);

//     socket.emit("connected");
//   });
//   //to join rooms
//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User Joined Room: " + room);
//   });

//   //for typimg
//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   //in real time message
//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       //we are sending the user id inside the room which i have created for room
//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });

//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
// });

server.listen(PORT, () => {
  console.log(`server is connected on this PORT ${PORT}`);
});
