// Request form
const passwordResetForm = document.getElementById('password-reset-form');
const identifierInput = document.getElementById('identifier');
const errorTextRequest = passwordResetForm?.querySelector('.error-text');

passwordResetForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const identifier = identifierInput.value;
	const response = await fetch('/api/password-reset', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier })
	});

	if (response.ok) {
		passwordResetForm.reset();
		window.location.href = '/password-reset-sent';
	} else {
		const json = await response.json();
		errorTextRequest.textContent = json.error;
	}
});

// Enter form
const passwordResetEnterForm = document.getElementById('password-reset-enter-form');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const errorTextEnter = passwordResetEnterForm?.querySelector('.error-text');
const passwordResetToken = window.location.pathname.split('/').pop();

passwordResetEnterForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (passwordInput.value !== passwordConfirmInput.value) {
		errorTextEnter.textContent = 'Passwords do not match';
		return;
	}

	const password = passwordInput.value;
	const response = await fetch('/api/password-reset-submit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ password, password_confirmation:
            passwordConfirmInput.value, token: passwordResetToken})
	});

	if (response.ok) {
		passwordResetEnterForm.reset();
		window.location.href = '/password-reset-success';
	} else {
		const json = await response.json();
		errorTextEnter.textContent = json.error;
	}
});