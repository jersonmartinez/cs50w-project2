/*-------------------------------------------*\
    Scroll To Top
\*-------------------------------------------*/

$("#ScrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});
//Animación Botón Subir , aparecer y desaparecer botón según scroll top+200px
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

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

        socket.on('message', function (msg) { //la conexion del cliente a servidor.
            $('#texto-mensaje').append('<p>' + msg + '</p><p class="meta"><time datetime="2021" style="color: black;">14:49</time></p>') // insertamos el contenido de a la lista, es decir el texto-msj.
        })

        $('#Enviar').on('click', function () { //nuestro boton tendra la funcion al momento de clikear de mandar ese contenido a texto-msj
            socket.send($('#content-msg').val());
            $('#content-msg').val('');
        })

        $('#content-msg').keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                socket.send($('#content-msg').val());
                $('#content-msg').val('');
            }
        });
    });

});

function openModal(id) {
    $('#' + id).click();
}