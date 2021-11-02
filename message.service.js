const uuid = require("uuid");

const messages = [];

exports.addMessage = (room, msg) => {
	const message = {id: uuid.v4(), room, ...msg};
	messages.push(message);
	return message;
}

exports.deleteMessage = (msgId) => {
	const index = messages.findIndex((message) => message.id === id);

	if (index !== -1) return messages.splice(index, 1)[0];
}

exports.getMessage = (id) => {
	const message = messages.find((message) => message.id === id);
	if(!messages) {
		return {error: "no such message exists!"}
	}
	return message;
}

exports.getMessagesInRoom = (room) => {
	const messages = messages.filter((message) => message.room === room);

	if(messages.length === 0) {
		return {error: "no messages!"}
	} else {
		return messages;
	}
}
  