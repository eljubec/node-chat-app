const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users')
const pulbicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
// configer the server to use socket.io - thats the reason why we switched to http
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(pulbicPath));
// socket.emit send to 1 person
// io.emit send it to every person &
io.on('connection', (socket) => {
    console.log('new user connected');

socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
       return callback('Name and room name are required.')
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //Die Person die NEU beigetreten ist bekommt diese message.
    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
    //Alle Personen die bereits beigetreten sind bekommen eine Nachricht wenn eine neue Person beigetreten ist.
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
});



//Skellet für createMessage => Man kann eine Nachricht erstellen und wird unmittelbar an alle anwesenden Personen geschickt.
socket.on('createMessage', (createMessage, callback, params) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(createMessage.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, createMessage.text));
    }

    callback();
});

socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
});
    
//disconnect Nachricht wenn jemand die Seite etc. verlassen hat.
socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
    });  
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});