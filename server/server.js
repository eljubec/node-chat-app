const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const pulbicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
// configer the server to use socket.io - thats the reason why we switched to http
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(pulbicPath));
// socket.emit send to 1 person
// io.emit send it to every person
io.on('connect', (socket) => {
    console.log('new user connected');

    socket.on('createMessage', function (createMessage) {
        console.log('createMessage', createMessage)
        io.emit('newMessage', {
            from: createMessage.from,
            text: createMessage.text,
            createdAt: new Date().getTime()
        });
    });
    
    socket.on('disconnect', () => {
        console.log('user disconected from server')
    });
})









server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});