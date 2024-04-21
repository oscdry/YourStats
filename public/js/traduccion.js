const toggle = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const dropdownContent = document.getElementById('dropdown-content');

const setItem = (key, value) => { localStorage.setItem(key, value); };
const getItem = (key) => { return localStorage.getItem(key); };
const removeItem = (key) => { localStorage.removeItem(key); };

const es = document.getElementById('es');
const en = document.getElementById('en');
const ca = document.getElementById('ca');

es.addEventListener('click', async () => await selectLanguage('es'));
en.addEventListener('click', async () => await selectLanguage('en'));
ca.addEventListener('click', async () => await selectLanguage('ca'));

const toggleDropdown = () => {
	toggle.classList.toggle('active');
	dropdownContent.classList.toggle('hide');
};

const selectLanguage = async (language) => {
	toggleDropdown(); // Cierra el dropdown después de la selección
	await changeLanguage(language); // Llama a cambiar el idioma incluso si es español
};

const changeLanguage = async (lang) => {
	langText.textContent = lang.toUpperCase();

	const currentLang = getItem('lang');
	if (currentLang === lang) return toggleDropdown();

	const url = new URL(window.location.href);  // Utiliza window.location.href

	// Actualiza o añade 'lang'
	url.searchParams.set('lang', lang);

	// Verifica si la URL contiene 'admin'. Si no es así, elimina el parámetro 'page'
	if (!url.pathname.includes('/admin')) {
		url.searchParams.delete('page');  // Elimina 'page' si no está en una ruta 'admin'
	} else if (!url.searchParams.has('page')) {
		url.searchParams.set('page', '1');  // Establece 'page' a 1 si no existe y la URL contiene 'admin'
	}

	// Actualiza la URL sin recargar la página
	history.pushState({}, '', url.toString());

	setItem('lang', lang, 365); // Guarda la selección de idioma en cookies por 365 días

	if (lang === 'es') {
		window.location.reload();
	} else {
		try {
			const response = await fetch(`/i18n/${lang}.json`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			for (const key in data) {
				const elementById = document.getElementById(key);
				if (elementById) {
					elementById.innerText = data[key];
				} else {
					const elementsByClass = document.getElementsByClassName(key);
					if (elementsByClass.length > 0) {
						Array.from(elementsByClass).forEach(element => {
							element.innerText = data[key];
						});
					}
				}
			}
			toggleDropdown();
		} catch (e) {
			console.error('Error al cargar el archivo JSON:', e);
		}
	}
};


toggle.addEventListener('click', toggleDropdown);

// Cargar idioma de las cookies o usar 'es' como predeterminado
let lang = getItem('lang');
if (!lang) {
	setItem('lang', 'es', 365);
}

(async () => {
	if (lang && lang !== 'es') {
		await changeLanguage(lang);
	}
	console.log('Idioma:', lang);
})();