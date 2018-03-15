$(document).ready(function () {

function scrollToBottom() {
    //selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child')
    //heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight) {
        messages.scrollTop(scrollHeight);
    };
};

let socket = io();
    socket.on('connect', function () {
        let params = $.deparam(window.location.search);

        socket.emit('join', params, function (err) {
            if(err) {
                alert(err)
                window.location.href = '/'
            } else {
                console.log('No error');
            }
        });
    });

    socket.on('disconnect', function () {
        console.log('disconected from server');
    });

    socket.on('updateUserList', function (users) {
        let ol = $('<ol></ol>');

        users.forEach(function (user) {
            ol.append($('<li></li>').text(user));
        });

        $('#users').html(ol);
    });

    socket.on('newMessage', function (newMessage){
        let formattedTime = moment(newMessage.createdAt).format('LT');
        let template = $('#message-template').html();
        let html = Mustache.render(template, {
            text: newMessage.text,
            from: newMessage.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
    });

    socket.on('newLocationMessage', function (newLocationMessage) {
        let formattedTime = moment(newLocationMessage.createdAt).format('LT');
        let template = $('#location-message-template').html();
        let html = Mustache.render(template, {
            url: newLocationMessage.url,
            from: newLocationMessage.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
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
            };
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

