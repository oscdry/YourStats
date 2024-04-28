import { timeout } from './constants.js';

const userId = window.location.pathname.split('/').pop();

// Update username in user view
const usernameInfoDiv = document.getElementById('user-info');
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
	usernameInfoDiv.classList.add('hide');
	usernameEditForm.classList.remove('hide');
	changeUserNameBtn.style.display = 'none';

	// Add event listener for cancel button
	cancelUsername.addEventListener('click', () => {
		usernameInfoDiv.classList.remove('hide');
		usernameEditForm.classList.add('hide');
		changeUserNameBtn.style.display = 'block';
	});

	// Add event listener for save button
	usernameEditForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const newUsername = usernameInput.value;
		if (!newUsername || newUsername === curUserName) {
			usernameInfoDiv.classList.remove('hide');
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
const changeUserBioBtn = document.getElementById('edit-bio');
const currentUserBio = document.getElementById('user-bio');

const editBioControls = document.getElementById('user-bio-editing');
const submitBio = document.getElementById('submit-bio');
const cancelBtn = document.getElementById('cancel-bio');

const resetState = (prevBioText) => {
	changeUserBioBtn.style.display = 'block';
	currentUserBio.setAttribute('readonly', '');
	currentUserBio.setAttribute('disabled', '');
	currentUserBio.parentElement.style.marginBottom = '0';
	currentUserBio.textContent = prevBioText;
	editBioControls.classList.add('hide');
};

changeUserBioBtn?.addEventListener('click', () => {
	const userBioText = currentUserBio.textContent;
	changeUserBioBtn.style.display = 'none';

	currentUserBio.removeAttribute('readonly');
	currentUserBio.removeAttribute('disabled');
	currentUserBio.parentElement.style.marginBottom = '12vh';
	editBioControls.classList.remove('hide');

	// On cancel
	cancelBtn.addEventListener('click', () => {
		resetState(userBioText);
	});

	// On save
	submitBio.addEventListener('click', async () => {
		if (currentUserBio.value === userBioText) {
			resetState(userBioText);
			return;
		}

		// Update bio
		try {
			const newUserBio = currentUserBio.value.trim();

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

			// Reload the view if OK
			window.location.reload();
		} catch (error) {
			console.error('Error:', error);
		}
	});
});

// user change image
const uploadPicBtn = document.getElementById('upload-pfp');
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
fileInput.addEventListener('change', async  function () {
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

// GameNames Rankings
const editGameNamesBtn = document.getElementById('edit-game-names');
const brawlGameNameInput = document.getElementById('brawl-game-name');
const lolGameNameInput = document.getElementById('lol-game-name');
const fortniteGameNameInput = document.getElementById('fortnite-game-name');

const submitRankingsBtn = document.getElementById('submit-rankings');
const calculatePointsBtn = document.getElementById('calculate-points');
const cancelRankingsBtn = document.getElementById('cancel-rankings');
const editingContainer = document.getElementById('ranking-editing');

const currentBrawlGameName = brawlGameNameInput.value.trim();
const currentLolGameName = lolGameNameInput.value.trim();
const currentFortniteGameName = fortniteGameNameInput.value.trim();

const resetStateRankings = () => {
	brawlGameNameInput.value = currentBrawlGameName;
	lolGameNameInput.value = currentLolGameName;
	fortniteGameNameInput.value = currentFortniteGameName;

	brawlGameNameInput.setAttribute('disabled', '');
	lolGameNameInput.setAttribute('disabled', '');
	fortniteGameNameInput.setAttribute('disabled', '');

	editGameNamesBtn.style.display = 'block';
	calculatePointsBtn.style.display = 'block';
	editingContainer.classList.add('hide');
};

editGameNamesBtn?.addEventListener('click', async () => {

	editGameNamesBtn.style.display = 'none';
	calculatePointsBtn.style.display = 'none';
	editingContainer.classList.remove('hide');

	brawlGameNameInput.removeAttribute('disabled');
	lolGameNameInput.removeAttribute('disabled');
	fortniteGameNameInput.removeAttribute('disabled');

	submitRankingsBtn.addEventListener('click', async () => {
		try {
			const brawlGameName = brawlGameNameInput.value.trim();
			const lolGameName = lolGameNameInput.value.trim();
			const fortniteGameName = fortniteGameNameInput.value.trim();

			if (!brawlGameName && !lolGameName && !fortniteGameName) {
				resetStateRankings();
				return;
			}

			if (brawlGameName === currentBrawlGameName && lolGameName === currentLolGameName && fortniteGameName === currentFortniteGameName) {
				resetStateRankings();
				return;
			}

			let gameNames = {};

			if (brawlGameName)
				gameNames.brawl = brawlGameName;

			if (lolGameName)
				gameNames.lol = lolGameName;

			if (fortniteGameName)
				gameNames.fortnite = fortniteGameName;


			const response = await fetch('/api/users/game-name', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(gameNames)
			});

			if (response.ok) {

				// Reload the page after successful update (it reloads the points)
				window.location.reload();
			} else {
				const json = await response.json();
				console.error('Error:', json.error);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	});

	cancelRankingsBtn.addEventListener('click', () => {
		resetStateRankings();
	});
});


// Calculate user's points
const calculatePointsText = document.getElementById('calculate-points-text');

const resetStatePoints = () => {
	calculatePointsBtn.removeAttribute('disabled');
	calculatePointsBtn.textContent = calculatePointsText.textContent;
	calculatePointsBtn.classList.remove('loading');
};

calculatePointsBtn?.addEventListener('click', async () => {

	calculatePointsBtn.setAttribute('disabled', '');
	calculatePointsBtn.textContent = '';
	calculatePointsBtn.classList.add('loading');

	try {
		const response = await fetch('/api/users/points/');

		if (response.ok) {
			await timeout(500);
			window.location.reload();
		} else {
			resetStatePoints();
			const json = await response.json();
			calculatePointsText.textContent = json.error;
		}
	} catch (error) {
		console.error('Error:', error);
	}
});