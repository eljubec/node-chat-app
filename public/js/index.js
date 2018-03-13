$(document).ready(function () {

let socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    socket.on('newMessage', (newMessage) => {
        let formattedTime = moment(newMessage.createdAt).format('LT');
        let template = $('#message-template').html();
        let html = Mustache.render(template, {
            text: newMessage.text,
            from: newMessage.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);


        // let li = $('<li></li>');
        // li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);

        // $('#messages').append(li)
    });

    socket.on('newLocationMessage', function (newLocationMessage) {
        let formattedTime = moment(newLocationMessage.createdAt).format('LT');
        let template = $('#location-message-template').html();
        let html = Mustache.render(template, {
            from: newLocationMessage.from,
            url: newLocationMessage.url,
            createdAt: formattedTime
        });

        $('#messages').append(html);
    });

    socket.on('disconnect', function () {
        console.log('disconected from server');
        });
    });


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
            locationButton.removeAttr('disabled').text('Send location');
            alert('Unable to fech location.')
        });
    });
});

