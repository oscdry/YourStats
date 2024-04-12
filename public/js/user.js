// update username in user view
const changeUserNameBtn = document.getElementById('changeUserNameBtn');
const currentUserName = document.getElementById('currentUserName');
const userTitle = document.querySelector('.user-title');

changeUserNameBtn?.addEventListener('click', () => {
	const userName = currentUserName.textContent;
	const userId = userTitle.getAttribute('data-user-id');

	// Create input field
	const inputChange = document.createElement('input');
	inputChange.value = userName;
	userTitle.insertBefore(inputChange, changeUserNameBtn);

	// Hide current username display
	currentUserName.style.display = 'none';

	// Hide changeUserNameBtn
	changeUserNameBtn.style.display = 'none';

	// Create save button
	const saveBtn = document.createElement('button');
	saveBtn.textContent = 'Save';
	userTitle.appendChild(saveBtn);

	// Create cancel button
	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancel';
	userTitle.appendChild(cancelBtn);

	// Add event listener for cancel button
	cancelBtn.addEventListener('click', () => {

		// Remove input field
		inputChange.remove();

		// Show current username display
		currentUserName.style.display = 'block';

		// Show changeUserNameBtn
		changeUserNameBtn.style.display = 'inline';

		// Remove save and cancel buttons
		saveBtn.remove();
		cancelBtn.remove();
	});

	// Add event listener for save button
	saveBtn.addEventListener('click', async () => {

		// Update username
		const newUserName = inputChange.value;

		// Your AJAX call to update the username
		try {
			const response = await fetch(`/api/update-user-username/${userId}`, {
				method: 'PUT',
				body: JSON.stringify({ username: newUserName }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {

				// Reload the view after successful update
				const json = await response.json();
				const token = json.token;
				ClearToken();
				SaveToken(token);
				window.location.reload();
				return;
			} else {

				// Handle error response
				console.error('Failed to update username');
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
	const userId = userTitle.getAttribute('data-user-id');

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
	saveBtn.textContent = 'Save';
	userBio.appendChild(saveBtn);

	// Create cancel button
	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancel';
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
document.addEventListener('DOMContentLoaded', () => {
	const uploadPicBtn = document.getElementById('uploadPicBtn');
	const fileInput = document.getElementById('fileInput');
	const profilePicContainer = document.querySelector('.profile-pic-container');
	const profilePic = document.querySelector('.profile-pic');
	const userId = document.querySelector('.user-title').dataset.userId;

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
	fileInput.addEventListener('change', function () {
		const file = this.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('image', file);
			formData.append('userId', userId);

			// Realizar la petición fetch para subir la imagen
			fetch('/api/upload', {
				method: 'POST',
				body: formData
			})
				.then(response => response.json())
				.then(data => {
					console.log([...formData]);
					
					// Actualizar la imagen de perfil con la nueva imagen subida
					// Asegúrate de que el servidor responda con la ruta o nombre de la imagen
					// Aquí asumimos que el servidor responde con la ruta de la imagen actualizada
					if (data.filePath) {
						profilePic.src = '/' + data.filePath;
					} else {

						// Manejar errores o respuesta inesperada
						console.error('Error al subir la imagen:', data);
					}
				})
				.catch(error => {
					console.error('Error en la petición fetch:', error);
				});
		}
	});
});