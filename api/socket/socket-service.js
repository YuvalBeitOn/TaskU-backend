 
module.exports = {
    createPrivateSocket,
    emitBoardUpdates,
    deletePrivateSocket,
    insertUserNotif
}

let privateSockets = {}

function createPrivateSocket(userId, socket) {
    privateSockets[userId] = socket;
    console.log('user got connection!', userId)

}

function insertUserNotif(notif) {
    console.log('insert user notif runing');
    console.log(notif.toUserId);
    if (privateSockets[notif.toUserId]) {
        console.log('has connection with ', notif.toUserId);
        privateSockets[notif.toUserId].emit('insertUserNotif', notif)
    } else {
        console.log('Insert user notif did not find ');
    }
}

function emitBoardUpdates(board) {
    // console.log('board members in socket <<<<<<<<<<:', board.members);
    board.members.forEach(member => {
        // console.log(member,'Member in for each');
        let isConnected = Object.keys(privateSockets).find(key => key === member._id)
        if (isConnected) {
            console.log('Found a connection in forEach');
            privateSockets[member._id].emit('update board', board)
        }

    });
}



function deletePrivateSocket(userId) {
    let isConnected = Object.keys(privateSockets).find(key => key === userId)
    if (isConnected) {
        delete privateSockets[userId]
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

