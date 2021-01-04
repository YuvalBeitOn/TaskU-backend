module.exports = {
	createPrivateSocket,
	emitBoardUpdates,
	deletePrivateSocket,
	insertUserNotif,
};

let privateSockets = {};

function createPrivateSocket(userId, socket) {
	privateSockets[userId] = socket;
	console.log('user got connection!', userId);
}

function insertUserNotif(notif) {
	console.log('insert user notif runing');
	console.log(notif.toUserId);
	if (privateSockets[notif.toUserId]) {
		console.log('has connection with ', notif.toUserId);
		privateSockets[notif.toUserId].emit('insertUserNotif', notif);
	} else {
		console.log('Insert user notif did not find ');
	}
}

function emitBoardUpdates(board, actionUserId) {
	console.log('The user I got on Socket Service is: ', actionUserId)
	board.members.forEach((member) => {
		let isConnected = Object.keys(privateSockets).find((key) => key === member._id && key !== actionUserId);
		if (isConnected) {
			console.log('Found a connection in forEach');
			privateSockets[member._id].emit('update board', board);
		}
	});
}

function deletePrivateSocket(userId) {
	let isConnected = Object.keys(privateSockets).find((key) => key === userId);
	if (isConnected) {
		delete privateSockets[userId];
		console.log(`socket for${userId} de_stroyed`);
	}
}

// function sendNotif(notif) {
//     if (privateSockets[notif.toUserId]) {
//         privateSockets[notif.toUserId].emit('insertUserNotif', notif)
//     } else {
//         pushNotifService.push(notif.toId, notif)
//     }
// }
