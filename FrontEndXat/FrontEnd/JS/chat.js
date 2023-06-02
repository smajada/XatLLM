const chatContainer = document.getElementById("chat-container");
const chatMessage = document.getElementById("message").value;

// Añadir amigos
function addFriend() {
	var http = new XMLHttpRequest();

	http.open("POST", "http://localhost:3000/XatLLM/Friend", true);
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	var mail = sessionStorage.getItem("mail");
	var session = sessionStorage.getItem("session");
	const addFriendInput = document.getElementById("addFriend").value;
	const respContainer = document.getElementById("respContainer");

	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = http.responseText;

			switch (response) {
				//0 El Servidor no respon
				case "0":
					var serverAns = document.createElement("div");
					serverAns.classList.add("respuesta");
					respContainer.appendChild(serverAns);
					serverAns.innerHTML = "Server does not respond";
					serverAns.classList.add("invalid");
					break;

				//1 Amic afegit
				case "1":
					var serverAns = document.createElement("div");
					serverAns.classList.add("respuesta");
					respContainer.appendChild(serverAns);
					serverAns.innerHTML = "Friend added successfully";
					break;
				//2 Amic no trobat
				case "2":
					var serverAns = document.createElement("div");
					serverAns.classList.add("respuesta");
					respContainer.appendChild(serverAns);
					serverAns.classList.add("invalid");
					serverAns.innerHTML = "Friend not found";
					break;

				//3 Usuari necessita loggin
				case "3":
					var serverAns = document.createElement("div");
					serverAns.classList.add("respuesta");
					respContainer.appendChild(serverAns);
					serverAns.classList.add("invalid");
					serverAns.innerHTML = "Loggin needed";
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

//Logout
function logOut() {
	window.sessionStorage.removeItem("mail");
	window.sessionStorage.removeItem("session");
	window.location.href = "login.html";
}

//Enviar y recibir mensajes
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

			let emisor = document.getElementById("showFriends").value;
			let chatEmisor = document.getElementById(emisor);

			if (chatEmisor) {
				var chat = chatEmisor.querySelector(".chat-friend");
				let mensajeChat = document.createElement("span");
				mensajeChat.textContent = mensaje.text;
				chat.appendChild(mensajeChat);
			}

			getMessage();
		}
	};
}

function sendMessage() {
	var http = new XMLHttpRequest();

	http.open("POST", "http://localhost:3000/XatLLM/Xat", true);
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	var mail = sessionStorage.getItem("mail");
	var session = sessionStorage.getItem("session");
	var receptor = document.getElementById("showFriends").value;
	var sms = document.getElementById("message").value;

	let chatReceptor = document.getElementById(receptor);

	if (chatReceptor) {
		var chat = chatReceptor.querySelector(".chat-user");
		var message = document.createElement("span");
		message.textContent = sms;
		chat.appendChild(message);
	}

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

//Mostrar el mail en el título
function mostrarMail() {
	// Obtener el elemento del título y del correo electrónico
	var tituloElemento = document.getElementById("titulo");
	var correoElemento = document.getElementById("correo");

	// Obtener el correo electrónico guardado en sessionStorage
	var correoGuardado = sessionStorage.getItem("mail");

	// Actualizar el contenido del título y el correo electrónico
	tituloElemento.textContent = "Bienvenido, ";
	correoElemento.textContent = correoGuardado;
}

//Mostrar los mensajes según la conversación que hayas elegido
function showConv() {
	var nombreEmisor = document.getElementById("showFriends").value;
	var divElement = document.getElementById(nombreEmisor);
	var cuerpoChat = document.getElementsByClassName("chat-body")[0];

	if (divElement) {
		var chatAntiguo = document.getElementsByClassName("chat-container");
		for (var i = 0; i < chatAntiguo.length; i++) {
			chatAntiguo[i].style.display = "none";
		}

		var chatEmisor = document.getElementById(nombreEmisor);
		chatEmisor.style.display = "flex";
	} else {
		var nuevoChat = document.createElement("div");
		nuevoChat.classList.add("chat-container");
		nuevoChat.id = nombreEmisor;

		var chatUser = document.createElement("div");
		chatUser.classList.add("chat-user");

		var chatFriend = document.createElement("div");
		chatFriend.classList.add("chat-friend");

		nuevoChat.appendChild(chatUser);
		nuevoChat.appendChild(chatFriend);
		cuerpoChat.appendChild(nuevoChat);

		var chatAntiguo = document.getElementsByClassName("chat-container");
		for (var i = 0; i < chatAntiguo.length - 1; i++) {
			chatAntiguo[i].style.display = "none";
		}

		var chatEmisor = document.getElementById(nombreEmisor);
		chatEmisor.style.display = "flex";
	}
}

document.getElementById("showFriends").addEventListener("change", showConv);
