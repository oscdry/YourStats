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
			});

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
			});

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
		});

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

const dataMode = gameUsernameInput?.getAttribute('data-mode');

switch (dataMode) {
	case 'lol':
		gameUsernameInput.placeholder = 'Enter your League of Legends username';
		break;

	case 'brawl':
		gameUsernameInput.placeholder = 'Enter your Brawl Stars tag';
		break;
}


// On submit of the game username form
// Universal for all games, the mode is set in the data-mode attribute of the input
gameUsernameForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const errorText = e.target.querySelector('.error-text');
	const usernameVal = gameUsernameInput.value.trim();

	if (usernameVal) {
		let response;
		let targetUrl = '';

		switch (dataMode) {
			case 'lol':

				// This response either returns 400 or redirects to the stats page
				response = await fetch('/api/riot-user/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username: usernameVal })
				});
				targetUrl = '/lol/stats/' + usernameVal;
				break;

			case 'brawl':

				// This response either returns 400 or redirects to the stats page
				response = await fetch('/api/brawl-user/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ tag: usernameVal })
				});
				targetUrl = '/brawl/stats/' + usernameVal;
				break;
		}

		if (!response.ok) {
			const json = await response.json();
			errorText.innerHTML = json.error;
			return;
		}

		window.location = targetUrl;
	}
});

