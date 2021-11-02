const users = [];

exports.addUser = (id, room, name, img) => {

	if(!name || !room) {
		return {error: "invalid params"}
	}

	const userExists = users.find((user) => user.room === room && user.name === name );

	if(userExists) {
		return {
			error: "username is already taken!"
		}
	}
	const user = { id, room, name, img };
	users.push({id, room, name, img});

	return user;
}

exports.deleteUser = (id) => {
	const userExists = users.findIndex((user) => user.id === id);
	if (index !== -1) {return users.splice(index, 1)[0];}
	else {return {error: "no such user!"}}
}


exports.getUser = (id) => {
	const userExists = users.find((user) => user.id === id);
	if(!userExists) {
		return {error: "no such user!"}
	}
}

exports.getUsersInRoom = (room) => {
	const usersExist = users.filter((user) => user.room === room);
	if(usersExist.length === 0) {
		return {error: "no such user!"}
	} else {
		return usersExist;
	}
}