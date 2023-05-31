const dotenv = require("dotenv");

dotenv.config();

const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    const isActiveUser = activeUsers.some((user) => user.userId === newUserId);

    if (!isActiveUser) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    console.log("Connected Users", activeUsers);
    // sending the activeUsers to the client side
    io.emit("get-users", activeUsers);
  });

  // send message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to: ", receiverId);
    console.log("data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("user Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
