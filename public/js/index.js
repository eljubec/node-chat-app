let socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    socket.on('newMessage', (newMessage) => {
        console.log('newMessage', newMessage)
        let li = $('<li></li>');
        li.text(`${newMessage.from}: ${newMessage.text}`);

        $('#messages').append(li)
    });

    socket.on('newLocationMessage', function (newLocationMessage) {
        let li = $('<li></li>');
        let a = $('<a target="_blank">Current Location</a>');

        li.text(`${newLocationMessage.from}: `);
        a.attr('href', newLocationMessage.url);
        li.append(a);
        $('#messages').append(li)
    });

    socket.on('disconnect', function () {
        console.log('disconected from server');
    });
});


$(document).ready(function () {
    $('#message-form').on('submit', function (e) {

        e.preventDefault();

        let messageTextbox = $('[name=message]');

        socket.emit('createMessage', {
            from: 'User',
            text: messageTextbox.val()
        }, function () {
            messageTextbox.val('');
        });
    });

    let locationButton = $('#send-location');
    locationButton.on('click', function () {
        if (!navigator.geolocation) {
            return alert('Geoloaction not supported your browser.');
        };

        locationButton.attr('disabled', 'disabled').text('loading..');

        navigator.geolocation.getCurrentPosition(function (position) {
            function sendLocationTimeOut() {
                setTimeout(function(){
                    locationButton.removeAttr('disabled').text('Send location');
                }, 1300);
            }
            sendLocationTimeOut();
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            locationButton.removeAttr('disabled')
            alert('Unable to fech location.')
        });
    });
});

