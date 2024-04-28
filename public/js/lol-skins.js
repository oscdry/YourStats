const searchBar = document.getElementById('skin-name-form');
const lolSkinsSearchList = document.getElementById('lol-skins-search-list');

function removeAllChildren(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

searchBar.addEventListener('submit', function (event) {

	event.preventDefault();

    
	const skinName = document.getElementById('skin-name-input').value.trim();
	if(skinName == '') {
		return ;
	}
	const url = `/api/lol/skins/${encodeURIComponent(skinName)}`;

	removeAllChildren(lolSkinsSearchList);
	fetch(url)
		.then(response => {

			if (response.ok) {

				return response.json();
			} else {

				throw new Error('Network response was not ok.');
			}
		})
		.then(data => {

			data.forEach(skin => {
				const skinCard = document.createElement('div');
				skinCard.classList.add('lol-skin-card');
			
				const img = document.createElement('img');
				img.src = skin.imageURL;
				img.alt = skin.name;
			
				const skinInfo = document.createElement('div');
				skinInfo.classList.add('skin-info');
			
				const skinName = document.createElement('p');
				skinName.classList.add('skin-name');
				skinName.textContent = skin.name;
			
				const skinPriceContainer = document.createElement('div');
				skinPriceContainer.classList.add('skin-price', 'd-flex', 'flex-row', 'gap-1');
			
				const priceLabel = document.createElement('p');
				priceLabel.textContent = 'Precio:';
			
				const priceValue = document.createElement('p');
				priceValue.textContent = skin.cost;
			
				skinPriceContainer.appendChild(priceLabel);
				skinPriceContainer.appendChild(priceValue);
			
				const skinReleaseContainer = document.createElement('div');
				skinReleaseContainer.classList.add('skin-release', 'd-flex', 'flex-row', 'gap-1');
			
				const releaseLabel = document.createElement('p');
				releaseLabel.textContent = 'Fecha:';
			
				const releaseValue = document.createElement('p');
				releaseValue.textContent = skin.releaseDate.split(':')[0].slice(0, -1);
			
				skinReleaseContainer.appendChild(releaseLabel);
				skinReleaseContainer.appendChild(releaseValue);
			
				skinInfo.appendChild(skinName);
				skinInfo.appendChild(skinPriceContainer);
				skinInfo.appendChild(skinReleaseContainer);
			
				skinCard.appendChild(img);
				skinCard.appendChild(skinInfo);
			
				lolSkinsSearchList.appendChild(skinCard);
			});
		})
		.catch(error => {

			console.error('Error fetching data:', error);
		});
});

