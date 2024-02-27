
// Login ---------------------------
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('login-username-input');
const passwordInput = document.getElementById('login-password-input');

loginSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // If filled inputs
    if (username && password) {
        //TODO: Check regex

        // Send request to server
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        if (!response.ok) {
            console.error('Error while logging in');
            console.log(await response.text());
            return;
        }

        const json = await response.json();
        const token = json.token;

        console.log(token);

        return;

    }
});

// ---------------------------

// Register