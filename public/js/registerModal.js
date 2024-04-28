import { validateEmail, validatePassword, validateUsername } from './constants.js';

const registerValidInput = false;

const usernameCheckbox = document.getElementById('username-valid');
const mailCheckbox = document.getElementById('mail-valid');
const passwordCheckbox = document.getElementById('password-valid');
const passwordConfirmationCheckbox = document.getElementById('password-confirmation-valid');

const registerPasswordInput = document.getElementById('register-password-input');

/**
 *
 * @param {Event} e
 */
export const usernameChangeListener = (e) => {
	const username = e.target.value;

	const valid = validateUsername(username);

	// console.log(valid);
	if (valid) {
		e.target.classList.remove('invalid');
		usernameCheckbox.setAttribute('checked', '');
		return;
	}
	e.target.classList.add('invalid');
	usernameCheckbox.removeAttribute('checked');
};

/**
 *
 * @param {Event} e
 */
export const emailChangeListener = (e) => {
	const email = e.target.value;

	const valid = validateEmail(email);

	// console.log(valid);
	if (valid) {
		e.target.classList.remove('invalid');
		mailCheckbox.setAttribute('checked', '');
		return;
	}
	e.target.classList.add('invalid');
	mailCheckbox.removeAttribute('checked');
};

/**
 *
 * @param {Event} e
 */
export const passwordChangeListener = (e) => {
	const password = e.target.value;

	const valid = validatePassword(password);

	// console.log(valid);
	if (valid) {
		e.target.classList.remove('invalid');
		passwordCheckbox.setAttribute('checked', '');
		return;
	}
	e.target.classList.add('invalid');
	passwordCheckbox.removeAttribute('checked');
};

/**
 *
 * @param {Event} e
 */
export const passwordConfirmationChangeListener = (e) => {
	const password = e.target.value;

	const valid = password === registerPasswordInput.value.trim();

	// console.log(valid);
	if (valid && password !== '' && registerPasswordInput.value.trim() !== '') {
		e.target.classList.remove('invalid');
		passwordConfirmationCheckbox.setAttribute('checked', '');
		return;
	}

	e.target.classList.add('invalid');
	passwordConfirmationCheckbox.removeAttribute('checked');
};

export const getRegisterValidInput = () => registerValidInput;
