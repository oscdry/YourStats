// Auth
const SaveToken = (token) => document.cookie = `token=${token};`;
const ClearToken = () => document.cookie = '';

const RedirectToHome = () => window.location.href = '/';
const ReloadPage = () => window.location.reload();

// Regex
const validateUsername = (username) => /^[a-zA-Z0-9_]{3,16}$/.test(username);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

// Login ---------------------------
const loginSubmit = document.getElementById('login-submit');
const loginUsernameInput = document.getElementById('login-username-input');
const loginPasswordInput = document.getElementById('login-password-input');

loginSubmit?.addEventListener('click', async (e) => {
    e.preventDefault();

    const errorText = e.target.parentElement.closest('.modal-content').querySelector('.error-text');
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    // If filled inputs
    if (username && password) {
        //TODO: Check regex

        try {
            console.log('Sending request to server');
            // Send request to server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok && response.status != 400) {
                errorText.innerHTML = 'An error occurred...';
                console.error(response.status + ' ' + response.statusText);
                return;
            }

            const json = await response.json();

            // API returns 400 if the user is not found
            // Which is not an error
            if (response.status === 400) {
                errorText.innerHTML = json.error;
                return;
            }

            const token = json.token;
            SaveToken(token);
            RedirectToHome();
            return;

        } catch (error) {
            console.error(error);
            errorText.innerHTML = 'Server error, try again later';
            return;
        }
    }
});

// Register  ---------------------------
const registerSubmit = document.getElementById('register-button-submit');
const registerUsernameInput = document.getElementById('register-username-input');
const registerMailInput = document.getElementById('register-mail-input');
const registerPasswordInput = document.getElementById('register-password-input');
const registerPasswordConfirmationInput = document.getElementById('register-password-confirmation-input');

registerSubmit?.addEventListener('click', async (e) => {
    e.preventDefault();

    const errorText = e.target.parentElement.closest('.modal-content').querySelector('.error-text');
    const username = registerUsernameInput.value.trim();
    const mail = registerMailInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const password_confirmation = registerPasswordConfirmationInput.value.trim();

    // If filled inputs
    if (username && mail && password && password_confirmation) {

        // Check regex
        // Username
        if (!validateUsername(username)) {
            errorText.innerHTML = 'Username must be 3-16 characters long and contain only letters, numbers and underscores';
            return;
        }
        // Mail
        if (!validateEmail(mail)) {
            errorText.innerHTML = 'Invalid mail';
            return;
        }
        // Password
        if (!validatePassword(password)) {
            errorText.innerHTML = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number';
            return;
        }
        // Password confirmation
        if (password !== password_confirmation) {
            errorText.innerHTML = 'Passwords do not match';
            return;
        }

        try {
            // Send request to server
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, mail, password, password_confirmation })
            })

            if (!response.ok) {
                errorText.innerHTML = json.error;
                return;
            }

            const json = await response.json();
            const token = json.token;
            SaveToken(token);
            RedirectToHome();
            return;

        } catch (error) {
            errorText.innerHTML = 'Server error, try again later';
            return;
        }
    }
});

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
            })

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
            })

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

document.addEventListener('DOMContentLoaded', function() {
    searchBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario para realizar la búsqueda con JavaScript
        const userEmail = searchInput.value.trim(); // Obtener el valor del input y eliminar espacios en blanco al principio y al final
        const userRows = document.querySelectorAll('.user-row'); // Seleccionar todas las filas de usuarios

        let found = false; // Indicador si se encontró el usuario

        userRows.forEach(row => {
            const mailCell = row.cells[2].textContent; // Asumiendo que el correo está en la tercera celda
            if(mailCell === userEmail) {
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
});

// Logout ---------------------------
const logoutButton = document.getElementById('logout-button');

logoutButton?.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        // Send request to server
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            console.error(response.status + ' ' + response.statusText);
            return;
        }

        // Delete token
        ClearToken();
        ReloadPage();
        return;

    } catch (error) {
        console.error('Server error, try again later');
        return;
    }
});


// ---------------------------

// Game input handling

const gameUsernameForm = document.getElementById('game-username-form');
const gameUsernameInput = document.getElementById('game-username-input');


// On submit of the game username form
gameUsernameForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorText = e.target.querySelector('.error-text');

    const usernameVal = gameUsernameInput.value.trim();
    if (usernameVal) {
        // This response either returns 400 or redirects to the stats page
        const response = await fetch('/lol/stats/' + usernameVal);

        if (!response.ok) {
            const json = await response.json();
            errorText.innerHTML = json.error;
            return;
        }

        // Redirect to the stats page
        window.location.href = '/lol/stats/' + usernameVal;
    }
});
