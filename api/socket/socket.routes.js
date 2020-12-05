
module.exports = connectSockets
var msgs = {}
function connectSockets(io) {
    io.on('connection', socket => {
        console.log('connection!');
        //BOARD APP:
        socket.on('board id', boardId=>{
            if (socket.boardId) {
                console.log('socket.boardId if:', socket.boardId)
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            socket.boardId = boardId;
            console.log('socket.boardId:', socket.boardId)
        
        })

        socket.on('update board',board=>{
            socket.broadcast.to(socket.boardId).emit('updated board',board)
        })
        
        socket.on('load boards',(boards)=>{
            socket.broadcast.to(socket.boardId).emit('load boards',boards)
        })
        //************* */
        //CHAT APP:
        socket.on('chat newMsg', msg=>{
            if(!msgs[socket.myTopic]) msgs[socket.myTopic] = []
            msgs[socket.myTopic].push(msg)
            console.log('///////////////////////')
             console.log('msgs: after', msgs)
             socket.emit('chat addMsg sender' ,{...msg,sender:'user-sender'})
            //  io.to(socket.myTopic).emit('chat addMsg', msg)
            socket.broadcast.to(socket.myTopic).emit('chat addMsg', msg)
         })
         
         socket.on('chat topic', topic=>{
             if (socket.myTopic) {
                 socket.leave(socket.myTopic)
             }
             socket.join(topic)
             socket.myTopic = topic;
 
             if(msgs[topic]){
                 console.log('In !!!');
                 console.log('********topic:', topic)
                 console.log('//////msgs:', msgs[topic])
             io.to(socket.myTopic).emit('history msg', msgs[topic]) 
             }
         })
         // user typing actions:
         socket.on('typing',user=>{
             const msg = user + ' ' + 'is typing...'
             console.log('msg:', msg)
             socket.broadcast.to(socket.myTopic).emit('msg',msg)
             // io.to(socket.myTopic).emit('isTyping',true)
             socket.broadcast.emit('isTyping',true)
         })
         //reset 
         socket.on('reset is typing',()=>{
             // io.to(socket.myTopic).emit('isTyping',false)
             socket.broadcast.emit('isTyping',false)
 
         })

    })
}



