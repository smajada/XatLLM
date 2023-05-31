const form = document.querySelector(".form");
const emailField = document.getElementById("email-field");
const emailInput = document.getElementById("mail");
const passField = document.getElementById("pass-field");
const passInput = document.getElementById("pass");
const cPassField = document.getElementById("cpassword-field");
const cPassInput = document.getElementById("cpass");

// Validación del correo electrónico
function checkEmail() {
	const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
	if (!emailInput.value.match(emailPattern)) {
		return emailField.classList.add("invalid");
	} else if (emailInput.value === "" || emailInput.value.match(emailPattern)) {
		emailField.classList.remove("invalid");
	}
}

// Cambiar la clase al hacer click en el ojo
const eyeIcons = document.querySelectorAll(".show-hide");

eyeIcons.forEach((eyeIcon) => {
	eyeIcon.addEventListener("click", () => {
		const pInput = eyeIcon.parentElement.querySelector("input");

		if (pInput.type === "password") {
			eyeIcon.classList.replace("bx-hide", "bx-show");
			pInput.type = "text"; // Cambiar el tipo de entrada a texto
		} else {
			eyeIcon.classList.replace("bx-show", "bx-hide");
			pInput.type = "password"; // Cambiar el tipo de entrada a contraseña
		}
	});
});

// Validacion de la contrasena
function createPass() {
	const passPattern  = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");
	if (!passInput.value.match(passPattern)) {
		return passField.classList.add("invalid");
	} else if (passInput.value === "" || passInput.value.match(passPattern)) {
		return passField.classList.remove("invalid");
	}
}

// Validacion de la confirmacion
function confirmPass() {
	if (passInput.value !== cPassInput.value || cPassInput.value === "") {
		return cPassField.classList.add("invalid");
	}
	cPassField.classList.remove("invalid");
}

// Registro de usuario
function registerUser(user, pass, mail, codeCountry) {
	var http = new XMLHttpRequest();
	var url = "http://localhost:3000/XatLLM/Register";

	// Construye los datos del formulario en formato 'application/x-www-form-urlencoded'
	var params =
		"user=" +
		encodeURIComponent(user) +
		"&pass=" +
		encodeURIComponent(pass) +
		"&mail=" +
		encodeURIComponent(mail) +
		"&codeCountry=" +
		encodeURIComponent(codeCountry);

	http.open("POST", url, true);

	// Establece la cabecera 'Content-type'
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			console.log("User registration successful:", http.responseText);
		}
	};

	http.send(params);

	window.location.replace("login.html")
}

// Obtener lista de países
function getCountries() {
	var http = new XMLHttpRequest();
	var url = "http://localhost:3000/XatLLM/Register";

	http.open("GET", url, true);

	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var data = JSON.parse(http.responseText);
			console.log("Country list:", data);
			
			// Llenar el select de países en el formulario
			var countrySelect = document.getElementById("codeCountry");
			data.forEach(function (country) {
				var option = document.createElement("option");
				option.value = country.code;
				option.text = country.name;
				countrySelect.appendChild(option);
			});
		}
	};

	http.send();
}

// Llamar a la funcion mientras se escribe
emailInput.addEventListener("keyup", checkEmail);
passInput.addEventListener("keyup", createPass);
cPassInput.addEventListener("keyup", confirmPass);

// Llamada a getCountries cuando la página se carga
window.addEventListener("load", function (e) {
	getCountries();

	// Llamada a registerUser cuando el usuario presiona el botón de registro
    const btnRegister = document.getElementById("submit");
	btnRegister.addEventListener("click", function (e) {
		e.preventDefault();
		var user = document.getElementById("user").value;
		var pass = document.getElementById("pass").value;
		var mail = document.getElementById("mail").value;
		var codeCountry = document.getElementById("codeCountry").value;

		registerUser(user, pass, mail, codeCountry);
	});
});
