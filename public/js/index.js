// Auth
const SaveToken = (token) => {
    localStorage.setItem('token', token);
}

const RedirectToHome = () => {
    window.location.href = '/';
}

// Login ---------------------------
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('login-username-input');
const passwordInput = document.getElementById('login-password-input');

loginSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const errorText = e.target.parentElement.closest('.modal-content').querySelector('.error-text');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // If filled inputs
    if (username && password) {
        //TODO: Check regex

        try {
            // Send request to server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok) {
                errorText.innerHTML = json.error;
                return;
            }

            const json = await response.json();
            const token = json.token;
            console.log(token);
            SaveToken(token);
            RedirectToHome();
            return;

        } catch (error) {
            errorText.innerHTML = 'Server error, try again later';
            return;
        }
    }
});

// ---------------------------

// Register
const registerSubmit = document.getElementById('register-button-submit');
const registerUsernameInput = document.getElementById('register-username-input');
const registerMailInput = document.getElementById('register-mail-input');
const registerPasswordInput = document.getElementById('register-password-input');
const registerPasswordConfirmationInput = document.getElementById('register-password-confirmation-input');

registerSubmit.addEventListener('click', async (e) => {
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
            console.log(token);
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

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones de editar
    const editButtons = document.querySelectorAll('.edit-btn');

    // Añadir un listener a cada botón de editar
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
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

backUpdateSubmit.addEventListener('click', async (e) => {
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
