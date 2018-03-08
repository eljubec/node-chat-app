let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    socket.on('newMessage', (newMessage) => {
        console.log('newMessage', newMessage)
    });
    
    socket.on('disconnect', function () {
        console.log('disconected from server');
    });
});









            