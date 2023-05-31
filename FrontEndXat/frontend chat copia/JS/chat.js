const chatContainer = document.getElementById("chat-container");
const chatMessage = document.getElementById("message").value;
const respContainer = document.getElementById("respuesta");

// Añadir amigos
function addFriend() {
	var http = new XMLHttpRequest();

	http.open("POST", "http://localhost:3000/XatLLM/Friend", true);
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	var mail = sessionStorage.getItem("mail");
	var session = sessionStorage.getItem("session");
	const addFriendInput = document.getElementById("addFriend").value;

	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = http.responseText;

			switch (response) {
				//0 El Servidor no respon
				case "0":
					respContainer.innerHTML = "";
					respContainer.append("Server does not respond");
					respContainer.classList.add("invalid");
					break;

				//1 Amic afegit
				case "1":
					respContainer.innerHTML = "";
					respContainer.append("Friend added successfully");
					break;
				//2 Amic no trobat
				case "2":
					respContainer.innerHTML = "";
					respContainer.append("Friend not found");
					respContainer.classList.add("invalid");
					break;

				//3 Usuari necessita loggin
				case "3":
					respContainer.innerHTML = "";
					respContainer.append("Loggin needed");
					respContainer.classList.add("invalid");
					break;
			}
		}
	};

	http.send(
		"mail=" +
			encodeURIComponent(mail) +
			"&session=" +
			encodeURIComponent(session) +
			"&friend=" +
			addFriendInput
	);
}

// Obtener lista de amigos
function getFriends() {
	var http = new XMLHttpRequest();
	var mail = sessionStorage.getItem("mail");
	var session = sessionStorage.getItem("session");
	var url =
		"http://localhost:3000/XatLLM/Friend?mail=" + mail + "&session=" + session;

	http.open("GET", url, true);

	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var data = JSON.parse(http.responseText);
			console.log("Friend list:", data);

			// Llenar el select de amigos
			var selectFriends = document.getElementById("showFriends");
			for (let i = 0; i < data.length; i++) {
				const friend = data[i];
				var option = document.createElement("option");
				option.value = friend;
				option.text = friend;
				selectFriends.appendChild(option);
			}
		}
	};

	http.send();
}

function logOut() {
	window.sessionStorage.removeItem("mail");
	window.sessionStorage.removeItem("session");
	window.location.href = "login.html";
}

function getMessage() {
	var http = new XMLHttpRequest();
	var mail = sessionStorage.getItem("mail");
	var session = sessionStorage.getItem("session");
	var url =
		"http://localhost:3000/XatLLM/Xat?mail=" + mail + "&session=" + session;

	http.open("GET", url, true);
	http.send();


	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {

			var mensaje = JSON.parse(http.responseText);
			console.log("Message list:", mensaje);

			let chat = document.getElementById("chat-friend");
			chat.innerHTML = mensaje.emisor+ ": " + mensaje.text;

      getMessage();
		}
	}

}

function sendMessage() {
  var http = new XMLHttpRequest();

  http.open("POST", "http://localhost:3000/XatLLM/Xat", true);
  http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  var mail = sessionStorage.getItem("mail");
  var session = sessionStorage.getItem("session");
  var receptor = document.getElementById("showFriends").value;
  var sms = document.getElementById("message").value;

  var messageUserDiv = document.getElementById("chat-user");
  var message = document.createElement("p");
  message.textContent = sms;
  messageUserDiv.appendChild(message);
  document.getElementById("message").value = "";

  var params =
    "mail=" +
    encodeURIComponent(mail) +
    "&session=" +
    encodeURIComponent(session) +
    "&receptor=" +
    encodeURIComponent(receptor) +
    "&sms=" +
    encodeURIComponent(sms);

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      console.log("Mensaje enviado exitosamente");
    }
  };

  http.send(params);
}

function mostrarMail(){
	// Obtener el elemento del título y del correo electrónico
var tituloElemento = document.getElementById('titulo');
var correoElemento = document.getElementById('correo');

// Obtener el correo electrónico guardado en sessionStorage
var correoGuardado = sessionStorage.getItem("mail");

// Actualizar el contenido del título y el correo electrónico
tituloElemento.textContent = 'Bienvenido, ';
correoElemento.textContent = correoGuardado;
}
