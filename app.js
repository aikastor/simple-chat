const cors = require("cors");
const http = require("http");

const socketLib = require("socket.io");
const express = require("express");
const { addUser, deleteUser, getUsersInRoom } = require("./user-service");
const { events } = require("./events");
const { addMessage, getMessagesInRoom } = require("./message.service");

const server = express();
server.use(cors());

const chatApp = http.createServer(server);
const socketIO = socketLib(chatApp, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["POST", "GET"],
		credentials: true
	}
});

socketIO.on("connection", (socket) => {
	const {roomId, name, img} = socket.handshake.data;
	socket.join(roomId);

	const user = addUser(socket.id, roomId, name, img);
	socketIO.in(roomId).emit(events.USER_JOINED_CHAT_EVENT, user);

	socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
		const message = addMessage(roomId, data);
		socketIO.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message);
	});

	socket.on(events.USER_START_TYPING_MESSAGE_EVENT, (data) => {
		socketIO.in(roomId).emit(events.USER_START_TYPING_MESSAGE_EVENT, data);
	  });

	socket.on(events.USER_STOP_TYPING_MESSAGE_EVENT, (data) => {
		socketIO.in(roomId).emit(events.USER_STOP_TYPING_MESSAGE_EVENT, data);
	});
	
	socket.on("disconnect", () => {
		deleteUser(socket.id);
		socketIO.in(roomId).emit(events.USER_LEFT_CHAT_EVENT, user);
		socket.leave(roomId);
	});
})

chatApp.listen(4000, ()=> {
	console.log(`app started on port 4000!`)
})

server.get("/rooms/:roomId/users", (req, res) => {
	const users = getUsersInRoom(req.params.roomId);
	return res.json({ users });
  });
  
server.get("/rooms/:roomId/messages", (req, res) => {
	const messages = getMessagesInRoom(req.params.roomId);
	return res.json({ messages });
});