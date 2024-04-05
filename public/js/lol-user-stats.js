// const gameCards = document.querySelectorAll('[data-game-card]');

// let modalActive = false;

// /**
//  * @param {Event} e
//  */
// const listener = (e) => {
// 	const modal = e.target.querySelector('.lol-game-info-modal');
// 	console.log(modal);

// 	if (modalActive) {
// 		modal.style.display = 'none';
// 		modalActive = false;
// 	} else {
// 		modal.style.display = 'flex';
// 		modalActive = true;
// 		e.target.removeEventListener('click', listener);
// 	}
// };


// gameCards.forEach((card) => {
// 	card.addEventListener('click', listener);
// 	console.log(card);
// });