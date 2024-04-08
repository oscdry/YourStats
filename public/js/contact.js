const modalContactoSuccess = new bootstrap.Modal(document.getElementById('modal-contacto-success'));

const modalContacto = new bootstrap.Modal(document.getElementById('modal-contacto'));

const contactSubmitBtn = document.getElementById('contact-submit');

const contactInputUsername = document.getElementById('contact-username-input');
const contactInputEmail = document.getElementById('contact-mail-input');
const contactInputContent = document.getElementById('contact-content-input');

const contactErrorText = document.getElementById('contact-error-text');

contactSubmitBtn.addEventListener('click', async (e) => {
	e.preventDefault();

	const username = contactInputUsername.value.trim();
	const email = contactInputEmail.value.trim();
	const content = contactInputContent.value.trim();

	if (username === '' || email === '' || content === '') {
		contactErrorText.innerText = 'Rellena todos los campos.';
		return;
	}

	const response = await fetch('/api/contact-form', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, email, content })
	});

	if (!response.ok) {
		const data = await response.json();
		if (data.error) {
			contactErrorText.innerText = data.error;
		}
		return;
	}

	contactErrorText.innerText = '';

	contactInputUsername.value = '';
	contactInputEmail.value = '';
	contactInputContent.value = '';

	// Success flow
	modalContactoSuccess.hide();
	modalContactoSuccess.show();

	// Wait for user to close the modal
	modalContactoSuccess._element.addEventListener('hidden.bs.modal', () => {
		window.location.reload();
	});

});