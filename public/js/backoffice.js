import { emailRegex, passwordRegex, usernameRegex } from './constants.js';

// User list with pagination
const before = document.getElementById('previous-currentPage');
const current = document.getElementById('currentPage');
const after = document.getElementById('after-currentPage');
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const count = document.getElementById('countUsers').textContent; // Obtener el count de usuarios desde el backend
let usersPerPage = 10; // Número de usuarios por página
let totalPages = Math.ceil(count / usersPerPage); // Calcular el número total de páginas
let currentPage = getPageNumberFromUrl(); // Obtener el número de página de la URL

updatePageNumbers();

document.getElementById('nextPage').addEventListener('click', () => {
	currentPage++;
	window.location.href = `/admin?page=${currentPage}`;

	// Llamamos a updatePageNumbers después de cambiar la página
	updatePageNumbers();
});

document.getElementById('prevPage').addEventListener('click', () => {
	currentPage = Math.max(1, currentPage - 1);
	window.location.href = `/admin?page=${currentPage}`;

	// Llamamos a updatePageNumbers después de cambiar la página
	updatePageNumbers();
});

function getPageNumberFromUrl() {
	const urlParams = new URLSearchParams(window.location.search);
	const page = parseInt(urlParams.get('page'));
	return isNaN(page) ? 1 : page; // Si no se encuentra 'page' en la URL, devuelve 1
}

function updatePageNumbers() {
	current.textContent = currentPage;

	// Establecer el texto de 'before' como el número de página actual menos 1
	before.textContent = Math.max(1, currentPage - 1);

	if (currentPage <= 1) {
		prevButton.disabled = true;
		before.style.display = 'none'; // Ocultar el botón 'before'
	} else {
		prevButton.disabled = false;
		before.style.display = 'inline'; // Mostrar el botón 'before'
	}

	// Si currentPage es igual al número total de páginas, deshabilitar el botón "next" y ocultar el botón "after"
	if (currentPage >= totalPages) {
		nextButton.disabled = true;
		after.style.display = 'none'; // Ocultar el botón 'after'
	} else {
		nextButton.disabled = false;
		after.style.display = 'inline'; // Mostrar el botón 'after'
	}

	after.textContent = currentPage + 1;
}

// backoffice update

const backUpdateSubmit = document.getElementById('back-update-button-submit');
const backUpdateUsernameInput = document.getElementById('back-update-username-input');
const backUpdateMailInput = document.getElementById('back-update-mail-input');
const backUpdateRoleInput = document.getElementById('back-update-role-input');
const backUpdatePasswordInput = document.getElementById('back-update-password-input');
const backUpdatePasswordConfirmationInput = document.getElementById('back-update-password-confirmation-input');

let currentUserId = null;


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
		if (!usernameRegex.test(username)) {
			errorText.innerHTML = 'Username must be 3-16 characters long and contain only letters, numbers and underscores';
			return;
		}

		// Mail
		if (!emailRegex.test(mail)) {
			errorText.innerHTML = 'Invalid mail';
			return;
		}

		// Password
		if (!passwordRegex.test(password)) {
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

// backoffice search user by mail

document.addEventListener('DOMContentLoaded', async () => {

	const searchBtn = document.getElementById('back-search-button');
	const searchInput = document.getElementById('back-search-mail-input');
	const errorSearch = document.getElementById('error-search-back');
	const tbody = document.querySelector('tbody');
	const beforeBtn = document.getElementById('prevPage');
	const afterBtn = document.getElementById('nextPage');
	const numBeforePage = document.getElementById('previous-currentPage');
	const numCurrentPage = document.getElementById('currentPage');
	const numAfterPage = document.getElementById('after-currentPage');

	searchBtn.addEventListener('click', async (e) => {
		e.preventDefault();

		const email = searchInput.value.trim();

		if (!email) {
			errorSearch.textContent = 'El campo de correo electrónico es obligatorio';

			// Recargar la página /admin
			window.location.href = '/admin';
			return;
		}

		errorSearch.textContent = '';

		try {
			const response = await fetch('/api/search-by-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			if (!response.ok) {
				throw new Error('Error al buscar usuarios por correo electrónico');
			}

			const users = await response.json();

			const existingRows = document.querySelectorAll('.user-row');
			existingRows.forEach(row => {
				if (!users.find(user => user.id === parseInt(row.children[0].textContent))) {
					row.remove();
				}
			});

			users.forEach(user => {
				if (!document.querySelector(`.user-row[data-id="${user.id}"]`)) {
					const tr = document.createElement('tr');
					tr.classList.add('user-row');
					tr.dataset.id = user.id;
					tr.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.mail}</td>
                        <td>${user.role}</td>
                        <td><a data-bs-toggle="modal" data-bs-target="#modal-back-update"
                            data-id="${user.id}"
                            data-username="${user.username}"
                            data-mail="${user.mail}"
                            data-role="${user.role}"
                            class="edit-btn">Edit</a></td>
                        <td><a href="/admin/users/delete/${user.id}">Delete</a></td>
                    `;
					tbody.appendChild(tr);

					const editButton = tr.querySelector('.edit-btn');
					editButton.addEventListener('click', function () {
						const username = this.getAttribute('data-username');
						const mail = this.getAttribute('data-mail');
						const role = this.getAttribute('data-role');
						const userId = this.getAttribute('data-id');

						backUpdateUsernameInput.value = username;
						backUpdateMailInput.value = mail;
						backUpdateRoleInput.value = role;
						currentUserId = userId;
					});
				}
			});

			// Ocultar los botones de paginación
			beforeBtn.style.display = 'none';
			afterBtn.style.display = 'none';
			numBeforePage.style.display = 'none';
			numCurrentPage.style.display = 'none';
			numAfterPage.style.display = 'none';

		} catch (error) {
			console.error('Error al buscar usuarios por correo electrónico:', error);
			errorSearch.textContent = 'Error interno del servidor';
		}
	});
});

