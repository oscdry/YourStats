import { RedirectToHome, SaveToken } from './index.js';

// Callback api call for Google Oauth login/register
const handleCredentialResponse = async (response) =>{
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

	const json = await apiResponse.json();
	const token = json.token;

	SaveToken(token);
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