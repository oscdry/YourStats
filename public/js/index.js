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