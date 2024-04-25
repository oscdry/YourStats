import {
	validateEmail,
	validatePassword,
	validateUsername
} from './constants.js';
import {
	usernameChangeListener,
	emailChangeListener,
	passwordChangeListener,
	passwordConfirmationChangeListener
} from './registerModal.js';


export const RedirectToHome = () => window.location = '/';
export const ReloadPage = () => window.location.reload();

const SetStorageItem = (key, value) => localStorage.setItem(key, value);
const GetStorageItem = (key) => localStorage.getItem(key);

// Login ---------------------------
const loginSubmit = document.getElementById('login-submit');
const loginUsernameInput = document.getElementById('login-username-input');
const loginPasswordInput = document.getElementById('login-password-input');

function getCookie(cname) {
	let name = cname + '=';
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

loginSubmit?.addEventListener('click', async (e) => {
	e.preventDefault();

	const errorText = e.target.parentElement.closest('.modal-content').querySelector('.error-text');
	const username = loginUsernameInput.value.trim();
	const password = loginPasswordInput.value.trim();

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
			});

			if (!response.ok && response.status != 400) {
				errorText.innerHTML = 'An error occurred...';
				console.error(response.status + ' ' + response.statusText);
				return;
			}


			// API returns 400 if the user is not found
			// Which is not an error
			if (response.status === 400) {
				const json = await response.json();
				errorText.innerHTML = json.error;
				return;
			}

			ReloadPage();
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

const registerModalErrorText = document.getElementById('register-error-text');

registerUsernameInput?.addEventListener('input', usernameChangeListener);
registerMailInput?.addEventListener('input', emailChangeListener);
registerPasswordInput?.addEventListener('input', passwordChangeListener);
registerPasswordConfirmationInput?.addEventListener('input', passwordConfirmationChangeListener);

registerSubmit?.addEventListener('click', async (e) => {
	e.preventDefault();

	const username = registerUsernameInput.value.trim();
	const mail = registerMailInput.value.trim();
	const password = registerPasswordInput.value.trim();
	const password_confirmation = registerPasswordConfirmationInput.value.trim();

	// If filled inputs
	if (username && mail && password && password_confirmation) {

		// Check regex
		// Username
		if (!validateUsername(username)) {
			registerModalErrorText.innerHTML = 'Username must be 3-16 characters long and contain only letters, numbers and underscores';
			return;
		}

		// Mail
		if (!validateEmail(mail)) {
			registerModalErrorText.innerHTML = 'Invalid mail';
			return;
		}

		// Password
		if (!validatePassword(password)) {
			registerModalErrorText.innerHTML = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number';
			return;
		}

		// Password confirmation
		if (password !== password_confirmation) {
			registerModalErrorText.innerHTML = 'Passwords do not match';
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
				const json = await response.json();
				registerModalErrorText.innerHTML = json.error;
				return;
			}

			ReloadPage();
			return;

		} catch (error) {

			// console.log(error);
			registerModalErrorText.innerHTML = 'Unknown server error, try again later';
			return;
		}
	}
});

// Logout ---------------------------
const logoutButton = document.getElementById('navbar-logout');

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

		if (!response.ok)
			console.error(response.status + ' ' + response.statusText);

		ReloadPage();
		return;

	} catch (error) {
		console.error(response.status + ' ' + response.statusText);
		return;
	}
});


// ---------------------------

// Game input handling
const gameUsernameForm = document.getElementById('game-username-form');
const gameUsernameInput = document.getElementById('game-username-input');

const dataMode = gameUsernameInput?.getAttribute('data-mode');


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
				const gameTagInput = document.getElementById('game-tag-input');
				const gameTagVal = gameTagInput.value.trim();


				// This response either returns 400 or redirects to the stats page
				response = await fetch('/api/riot-user/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username: usernameVal, tag: gameTagVal})
				});
				targetUrl = '/lol/stats/' + usernameVal + '/' + gameTagVal;
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

// ---------------------------

// Cookies handling
const cookiesModal = document.getElementById('cookies-modal');

if (cookiesModal && !GetStorageItem('cookies')) {
	cookiesModal.classList.remove('hide');
	const cookiesAcceptButton = document.getElementById('cookies-accept-button');
	const cookiesRejectButton = document.getElementById('cookies-reject-button');

	const hideModal = () => {
		cookiesModal.classList.add('hide');
		setTimeout(() => {
			cookiesModal.remove();
		}, 1500);
	};

	const cookiesAccept = () => {
		SetStorageItem('cookies', '1');
		hideModal();
	};

	const cookiesReject = () => {
		SetStorageItem('cookies', '0');
		hideModal();
	};

	cookiesAcceptButton.addEventListener('click', cookiesAccept);
	cookiesRejectButton.addEventListener('click', cookiesReject);
} else {
	cookiesModal.remove();
}

const toggleEventListener = (e) => {
	e.preventDefault();
	e.target.classList.toggle('active');
};

const toggles = document.querySelectorAll('.toggle');

toggles.forEach(toggle => {
	toggle.addEventListener('click', toggleEventListener);
});

// setInterval(() => {
// 	console.log(getCookie('token'));
// }, 500);