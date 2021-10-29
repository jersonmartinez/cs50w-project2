var channels = {
    data: []
};

var messages = {
    data: []
};

messages.data.push({ 'username': 'x', 'message': 'x', 'channel': 'x', 'time_hour_minute': 'x' });
localStorage.setItem('messages', JSON.stringify(messages));

var channel_selected = '';

var FormAdminLogin = document.getElementById('FormAdminLogin');
if (FormAdminLogin !== null)
    FormAdminLogin.addEventListener('keypress', captureEventEnterAdminForm);

function captureEventEnterAdminForm(e) {
    if (e.which == 13)
        sendFormLogin();
}

$("#ScrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});

$(function () {
    var header = $(".scroll-top");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 200) header.removeClass("scroll-top").addClass("go-up");
        else header.removeClass("go-up").addClass("scroll-top");
    });
});

/*Configuración del toast*/
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-left",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener('DOMContentLoaded', () => {
    initChannels();

    socket.on('connect', () => {
        socket.on('message', function (msg) {
            console.log(msg);

            $('#texto-mensaje').append( '' +
                '<p class="username">@' + msg.username + ' <img class="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..."></p>' +
                '<p class="message">' + msg.message + '</p>' +
                '<p class="meta">' +
                '<time datetime="2021" style="color: #9b9b9b; float:right;">' + msg.time_hour_minute + '</time>' +
                '</p>'
            );

            localStorage.setItem('messages', JSON.stringify(messages));

            var objDiv = document.getElementById("chat-content");
            objDiv.scrollTop = objDiv.scrollHeight;

        });

        socket.on('getchannel', function (msg) {
            if (checkChannel(msg)) {
                localStorage.setItem('channel_name', JSON.stringify(channels));
            }

            $(".channel_list").append('' +
                '<li class="channel_item" value="' + msg + '">' +
                    '<a href="#"><i class="fas fa-hashtag"></i> ' + msg + '</a>' +
                '</li>'
            );
        });

        $('#Enviar').on('click', function () {
            sendMessage();
        })

        $('#content-msg').keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                sendMessage();
            }
        });

        $('#input-content-channel').keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                createChannel();
            }
        });
    });

    $(document).on('click', ".channel_item", function () {
        $('.channel_item').removeClass('active');
        $(this).addClass("active");

        openChannel($(this).attr('value'));
        initMessages();
    });

    $("#action_logout").click(function(){
        logout();
    });

});

function sendMessage(){
    var username = $("#session_username").val(),
        message = $('#content-msg');
    
    var today = new Date();
    var date = today.getHours() + ':' + today.getMinutes();

    if (message.val() != '') {
        messages.data.push({ 'username': username, 'message': message.val(), 'channel': channel_selected, 'time_hour_minute': date });
        socket.send({ 'channel': channel_selected, 'message': $('#content-msg').val(), 'time_hour_minute': date});
        message.val('');
    } else {
        toastr.error('El mensaje no puede estar vacio');
    }
}

function createChannel(){
    var message = $('#input-content-channel');

    if (message.val() != '') {

        if (checkChannel(message.val())){
            toastr.error('El canal ya existe');
        } else {
            channels.data.push({ name: $('#input-content-channel').val() });
    
            socket.emit('getchannel', message.val());
            message.val('');

            toastr.success('El canal se ha creado');
        }

    } else {
        toastr.error('El nombre del canal no puede estar vacio');
    }
}

function openModal(id) {
    $('#' + id).click();
}

function openChannel(channel){
    $('.channel_title').html( '' +
        '<strong>' + 
            '<i class="fas fa-hashtag"></i> ' + channel + 
        '</strong>'
    );

    channel_selected = channel;
}

checkChannel = function (channel) {
    for (var i = 0; i < channels.data.length; i++)
        if (channels.data[i].name == channel)
            return true;

    return false;
}

initChannels = function () {
    if (localStorage.getItem('channel_name') != null) {
        channels = JSON.parse(localStorage.getItem('channel_name'));
    }

    for (var i = 0; i < channels.data.length; i++) {
        $(".channel_list").append('' +
            '<li class="channel_item" value="' + channels.data[i].name + '">' +
                '<a href="#"><i class="fas fa-hashtag"></i> ' + channels.data[i].name + '</a>' +
            '</li>'
        );
    }
}

initMessages = function () {
    if (channel_selected != null) {
        messages = JSON.parse(localStorage.getItem('messages'));

        console.log(messages);

        $('#texto-mensaje').html('');

        if (messages != null){
            for (var i = 0; i < messages.data.length; i++) {
                console.log(messages.data[i] + messages.data[i].username + ' ' + channel_selected);
                if (messages.data[i].channel == channel_selected) {
    
                    $('#texto-mensaje').append( '' +
                        '<p class="username">@' + messages.data[i].username + ' <img class="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..."></p>' +
                        '<p class="message">' + messages.data[i].message + '</p>' +
                        '<p class="meta">' +
                        '<time datetime="2021" style="color: #9b9b9b; float:right;">' + messages.data[i].time_hour_minute + '</time>' +
                        '</p>'
                    );
                }
            }
        }
    }

    var objDiv = document.getElementById("chat-content");
    objDiv.scrollTop = objDiv.scrollHeight;
}

logout = function () {
    localStorage.removeItem('channel_name');
    window.location.href = '/logout';
}

function goodEmptyCheck(value) {
    Object.keys(value).length === 0
        && value.constructor === Object; // 👈 constructor check
}