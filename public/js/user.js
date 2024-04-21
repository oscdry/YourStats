const userId = window.location.pathname.split('/').pop();

// update username in user view
const usernameTitleDiv = document.getElementById('user-title');
const usernameEditForm = document.getElementById('user-title-editing');

const changeUserNameBtn = document.getElementById('edit-username');
const currentUserName = document.getElementById('current-username');
const usernameInput = document.getElementById('new-username-input');
const submitUsername = document.getElementById('submit-username');
const cancelUsername = document.getElementById('cancel-username');

const errorText = usernameEditForm.querySelector('.error-text');

changeUserNameBtn?.addEventListener('click', () => {
	const curUserName = currentUserName.textContent;

	// Hide current username display
	usernameTitleDiv.classList.add('hide');
	usernameEditForm.classList.remove('hide');
	changeUserNameBtn.style.display = 'none';

	// Add event listener for cancel button
	cancelUsername.addEventListener('click', () => {
		usernameTitleDiv.classList.remove('hide');
		usernameEditForm.classList.add('hide');
		changeUserNameBtn.style.display = 'block';
	});

	// Add event listener for save button
	usernameEditForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const newUsername = usernameInput.value;
		if (!newUsername || newUsername === curUserName) {
			usernameTitleDiv.classList.remove('hide');
			usernameEditForm.classList.add('hide');
			return;
		}

		try {
			const response = await fetch(`/api/update-user-username/${userId}`, {
				method: 'PUT',
				body: JSON.stringify({ username: newUsername }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {

				// Reload the view after successful update
				window.location.reload();
				return;
			} else {

				// Handle error response
				const json = await response.json();
				errorText.textContent = json.error;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	});
});

// Update user Bio in user view
const changeUserBioBtn = document.getElementById('changeUserBioBtn');
const currentUserBio = document.getElementById('currentUserBio');
const userBio = document.querySelector('.bio-info');

changeUserBioBtn?.addEventListener('click', () => {
	const userBioText = currentUserBio.textContent;

	// Create textarea field
	const textareaChange = document.createElement('textarea');
	textareaChange.value = userBioText;
	userBio.insertBefore(textareaChange, changeUserBioBtn);

	// Hide current bio display
	currentUserBio.style.display = 'none';

	// Hide changeUserBioBtn
	changeUserBioBtn.style.display = 'none';

	// Create save button
	const saveBtn = document.createElement('button');
	saveBtn.textContent = 'Guardar';
	saveBtn.id = 'bio-saveChanges';
	userBio.appendChild(saveBtn);

	// Create cancel button
	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancelar';
	cancelBtn.id = 'bio-cancelChanges';
	userBio.appendChild(cancelBtn);

	// Add event listener for cancel button
	cancelBtn.addEventListener('click', () => {

		// Remove textarea field
		textareaChange.remove();

		// Show current bio display
		currentUserBio.style.display = 'block';

		// Show changeUserBioBtn
		changeUserBioBtn.style.display = 'inline';

		// Remove save and cancel buttons
		saveBtn.remove();
		cancelBtn.remove();
	});

	// Add event listener for save button
	saveBtn.addEventListener('click', async () => {

		// Update bio
		const newUserBio = textareaChange.value;

		try {
			const response = await fetch(`/api/update-user-bio/${userId}`, {
				method: 'PUT',
				body: JSON.stringify({ bio: newUserBio }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to update bio');
			}

			// Reload the view after successful update
			window.location.reload();
		} catch (error) {
			console.error('Error:', error);
		}
	});
});

// user change image
const uploadPicBtn = document.getElementById('uploadPicBtn');
const profilePicContainer = document.querySelector('.profile-pic-container');
const profilePic = document.querySelector('.profile-pic');
const fileInput = document.getElementById('fileInput');

// Mostrar el botón de subir imagen al pasar el mouse sobre la imagen de perfil
profilePicContainer.addEventListener('mouseover', () => {
	uploadPicBtn.style.display = 'block';
});

// Ocultar el botón de subir imagen cuando el mouse sale del contenedor
profilePicContainer.addEventListener('mouseout', () => {
	uploadPicBtn.style.display = 'none';
});

// Abrir el selector de archivos al hacer clic en el botón
uploadPicBtn.addEventListener('click', () => {
	fileInput.click();
});

// Manejar la selección de archivo y enviar la imagen al servidor
fileInput.addEventListener('change', async  () => {
	const file = this.files[0];
	if (file) {
		const formData = new FormData();
		formData.append('image', file);
		formData.append('userId', userId);

		// Realizar la petición fetch para subir la imagen
		const response = await fetch('/api/upload/' + userId, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {

			// Recargar la página después de subir la imagen
			window.location.reload();
		} else {
			console.error('Failed to upload image: ' + response.status + ' ' + response.statusText);
			const json = await response.json();

			const errorText = document.querySelector('.error-text');
			errorText.textContent = json.error;
		}
	}
});