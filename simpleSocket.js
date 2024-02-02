import { Server } from "socket.io";
const messages = []; // store messages -> need a database to get user's conversation messages
let key = null;

const io = new Server(3002, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket, id) => {
  console.log("a user connected");

  socket.on("joinRoom", (room) => {
    // Join a specific room when requested
    socket.join(room);
    console.log(`Socket joined room: ${room}`);
  });

  socket.on("message", (msg, id) => {
    console.log(msg, id);
    messages.push({ msg, id }); // store message in a database
    io.to(id).emit("message", msg);
  });

  socket.on("getMessages", (id) => {
    console.log("getMessages", id);
    const messageWithoutId = messages
      .filter((message) => message.id === id)
      .map((message) => message.msg);
    console.log(messageWithoutId);
    io.to(id).emit("messages", messageWithoutId);
  });
});
