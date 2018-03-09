let socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    socket.on('newMessage', (newMessage) => {
        console.log('newMessage', newMessage)
        let li = $('<li></li>');
        li.text(`${newMessage.from}: ${newMessage.text}`);

        $('#messages').append(li)
    });

    socket.on('disconnect', function () {
        console.log('disconected from server');
    });
});

$(document).ready(function () {
    $('#message-form').on('submit', function (e) {
        e.preventDefault();
    
        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function () {

        });
    });
});