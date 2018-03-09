const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message')
const pulbicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
// configer the server to use socket.io - thats the reason why we switched to http
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(pulbicPath));
// socket.emit send to 1 person
// io.emit send it to every person &
io.on('connection', (socket) => {
    console.log('new user connected');
//Die Person die NEU beigetreten ist bekommt diese message.
socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));

//Alle Personen die bereits beigetreten sind bekommen eine Nachricht wenn eine neue Person beigetreten ist.
socket.broadcast.emit('newMessage', generateMessage('Admin', 'new USER joined'));

//Skellet für createMessage => Man kann eine Nachricht erstellen und wird unmittelbar an alle anwesenden Personen geschickt.
socket.on('createMessage', (createMessage) => {
    console.log('createMessage', createMessage);
    io.emit('newMessage', generateMessage(createMessage.from, createMessage.text));
    });
    
//disconnect Nachricht wenn jemand die Seite etc. verlassen hat.
socket.on('disconnect', () => {
    console.log('user disconected from server')
    });  
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});