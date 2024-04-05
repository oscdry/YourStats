// backoffice update

const backUpdateSubmit = document.getElementById('back-update-button-submit');
const backUpdateUsernameInput = document.getElementById('back-update-username-input');
const backUpdateMailInput = document.getElementById('back-update-mail-input');
const backUpdateRoleInput = document.getElementById('back-update-role-input');
const backUpdatePasswordInput = document.getElementById('back-update-password-input');
const backUpdatePasswordConfirmationInput = document.getElementById('back-update-password-confirmation-input');

let currentUserId = null;

document.addEventListener('DOMContentLoaded', function () {

	// Seleccionar todos los botones de editar
	const editButtons = document.querySelectorAll('.edit-btn');

	// Añadir un listener a cada botón de editar
	editButtons?.forEach(button => {
		button.addEventListener('click', function () {

			// Obtener los datos del usuario desde los atributos data-*
			const username = this.getAttribute('data-username');
			const mail = this.getAttribute('data-mail');
			const role = this.getAttribute('data-role');
			const userId = this.getAttribute('data-id');

			// Establecer los valores en el formulario del modal
			backUpdateUsernameInput.value = username;
			backUpdateMailInput.value = mail;
			backUpdateRoleInput.value = role;
			currentUserId = userId;


			// Agrega aquí un campo oculto o una variable para almacenar el userId si planeas usarlo
			// Por ejemplo, podrías tener un input oculto en tu formulario para el userId
			// document.getElementById('back-update-user-id').value = userId;
		});
	});
});

backUpdateSubmit?.addEventListener('click', async (e) => {
	e.preventDefault();

	const errorText = e.target.parentElement.closest('.modal-content').querySelector('.error-text');
	const username = backUpdateUsernameInput.value.trim();
	const mail = backUpdateMailInput.value.trim();
	const password = backUpdatePasswordInput.value.trim();
	const password_confirmation = backUpdatePasswordConfirmationInput.value.trim();
	const role = backUpdateRoleInput.value.trim();

	// If filled inputs
	if (username && mail && password && password_confirmation && role) {

		// Check regex
		// Username
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
			errorText.innerHTML = 'Username must be 3-16 characters long and contain only letters, numbers and underscores';
			return;
		}

		// Mail
		if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(mail)) {
			errorText.innerHTML = 'Invalid mail';
			return;
		}

		// Password
		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
			errorText.innerHTML = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number';
			return;
		}

		// Password confirmation
		if (password !== password_confirmation) {
			errorText.innerHTML = 'Passwords do not match';
			return;
		}

		// Role
		if (role <= 0 && role >= 1) {
			errorText.innerHTML = 'Invalid role';
			return;
		}

		try {

			// Send request to server
			const response = await fetch(`/admin/users/update/${currentUserId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, mail, password, password_confirmation, role })
			});

			if (!response.ok) {
				errorText.innerHTML = json.error;
				return;
			}

			window.location.reload('/admin');


		} catch (error) {
			errorText.innerHTML = 'Server error, try again later';
			return;
		}
	} else if (username && mail && role) {

		// Username
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
			errorText.innerHTML = 'Username must be 3-16 characters long and contain only letters, numbers and underscores';
			return;
		}

		// Mail
		if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(mail)) {
			errorText.innerHTML = 'Invalid mail';
			return;
		}

		// Role
		if (role <= 0 && role >= 1) {
			errorText.innerHTML = 'Invalid role';
			return;
		}

		try {

			// Send request to server
			const response = await fetch(`/admin/users/update/${currentUserId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, mail, role })
			});

			if (!response.ok) {
				errorText.innerHTML = json.error;
				return;
			}

			window.location.reload('/admin');


		} catch (error) {
			errorText.innerHTML = 'Server error, try again later';
			return;
		}
	}
});

// backoffice search user by username

const searchBtn = document.getElementById('back-search-button');
const searchInput = document.getElementById('back-search-mail-input');
const errorSearch = document.getElementById('error-search-back');

searchBtn?.addEventListener('click', (event) => {
	event.preventDefault(); // Prevenir el envío del formulario para realizar la búsqueda con JavaScript
	const userEmail = searchInput.value.trim(); // Obtener el valor del input y eliminar espacios en blanco al principio y al final
	const userRows = document.querySelectorAll('.user-row'); // Seleccionar todas las filas de usuarios

	// Verificar si el input está en blanco
	if (userEmail === '') {

		// Mostrar todas las filas y no mostrar mensaje de error
		userRows.forEach(row => {
			row.style.display = '';
		});
		errorSearch.textContent = ''; // Asegurarse de que no se muestre el mensaje de error
		return; // Salir de la función para no ejecutar el código de búsqueda
	}

	let found = false; // Indicador si se encontró el usuario

	userRows.forEach(row => {
		const mailCell = row.cells[2].textContent; // Asumiendo que el correo está en la tercera celda
		if (mailCell === userEmail) {

			// Si el correo coincide, mostrar solo esa fila y marcar que se encontró el usuario
			row.style.display = '';
			found = true;
		} else {

			// Si no coincide, ocultar la fila
			row.style.display = 'none';
		}
	});

	// Si después de la búsqueda no se encontró ningún usuario, mostrar mensaje de error
	if (!found) {
		errorSearch.textContent = 'No user found with that email';
	} else {
		errorSearch.textContent = ''; // Limpiar el mensaje de error si se encontró al usuario
	}
});