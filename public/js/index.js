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
