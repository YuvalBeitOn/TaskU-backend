
module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('sendMsg', msg => {
            socket.broadcast.to(socket.myTopic).emit('addMsg', msg);

            // io.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            // io.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('chat topic', topic => {
            console.log('The user has joined the chat of: ', topic)
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
    })
}