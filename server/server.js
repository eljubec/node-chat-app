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


io.on('connect', (socket) => {
    console.log('new user connected');

    socket.on('disconnect', () => {
        console.log('user disconected from server')
    });
    socket.on('')
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});