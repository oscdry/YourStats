import { RedirectToHome } from './index.js';

// Callback api call for Google Oauth login/register
const handleCredentialResponse = async (response) =>{

	// Disable login and register buttons
	const loginBtn = document.querySelector('[data-bs-toggle="modal"][data-bs-target="#modal-login"]');
	const registerBtn = document.querySelector('[data-bs-toggle="modal"][data-bs-target="#modal-register"]');

	if (loginBtn)
		loginBtn.disabled = true;
	if (registerBtn)
		registerBtn.disabled = true;

	// Darken the page
	const body = document.body;
	body.style.pointerEvents = 'none';
	body.style.transition = 'opacity 0.5s';
	body.style.opacity = '0.65';

	// Send the credential to the server
	const apiResponse = await fetch('/api/login-google', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			credential: response.credential
		})
	});

	if (!apiResponse.ok) {
		console.error(apiResponse.status + ' ' + apiResponse.statusText);
		return;
	}

	RedirectToHome();
};

google.accounts.id.initialize({
	client_id: '8939685-o23s0dt6nbo3en57nevuntav68hhnhp2.apps.googleusercontent.com',
	callback: handleCredentialResponse
});

const options = {theme: 'outline', size: 'large'};

window.onload = () => {
	const googleLoginBtn = document.getElementById('login-google');
	const googleRegisterBtn = document.getElementById('register-google');

	// If both of these don't exist, user is already logged in
	if (googleLoginBtn) {
		google.accounts.id.renderButton(
			googleLoginBtn,
			options
		);

		google.accounts.id.prompt(); // also display the One Tap dialog
	}

	if (googleRegisterBtn) {
		google.accounts.id.renderButton(
			googleRegisterBtn,
			options
		);
	}
};