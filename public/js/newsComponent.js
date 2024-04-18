const newsContainer = document.getElementById('news-container');

const headers = newsContainer.querySelectorAll('a.news-header-item');
const contents = newsContainer.querySelectorAll('.news-body-item');

const pairs = [];

const removeActive = () => {
	headers.forEach(header => {
		header.classList.remove('active');
	});
	contents.forEach(content => {
		content.classList.remove('active');
	});
};

let index = 0;
headers.forEach(header => {
	pairs.push({ header, content: contents[index] });
	index++;
});


const listener = (e, pair) => {
	e.preventDefault();

	removeActive();

	pair.header.classList.add('active');
	pair.content.classList.add('active');
	console.log('clicked');
};

pairs.forEach(pair => {
	pair.header.addEventListener('click', (e) => listener(e, pair));
});

const randomChosenIndex = Math.floor(Math.random() * pairs.length);
pairs[randomChosenIndex].header.classList.add('active');
pairs[randomChosenIndex].content.classList.add('active');

