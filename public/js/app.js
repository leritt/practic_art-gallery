// Главная страница - получение картин
document.addEventListener("DOMContentLoaded", async () => {
    const artworkList = document.getElementById('artwork-list');

    // Загружаем картины с сервера (API /artworks)
    const response = await fetch('http://localhost:3000/artworks');
    const artworks = await response.json();

    // Отображаем картины на главной странице
    artworks.forEach(artwork => {
        const artworkDiv = document.createElement('div');
        artworkDiv.classList.add('artwork');
        artworkDiv.innerHTML = `
            <img src="${artwork.image_url}" alt="${artwork.title}">
            <h3>${artwork.title}</h3>
            <p>${artwork.price} $</p>
            <a href="artwork.html?id=${artwork.id}">Подробнее</a>
        `;
        artworkList.appendChild(artworkDiv);
    });
});

// Страница картины - получение данных конкретной картины и комментариев
const params = new URLSearchParams(window.location.search);
const artworkId = params.get('id');
if (artworkId) {
    document.addEventListener("DOMContentLoaded", async () => {
        // Получаем информацию о картине
        const artworkResponse = await fetch(`http://localhost:3000/artworks/${artworkId}`);
        const artwork = await artworkResponse.json();
        document.getElementById('artwork-title').innerText = artwork.title;
        document.getElementById('artwork-image').src = artwork.image_url;
        document.getElementById('artwork-description').innerText = artwork.description;
        document.getElementById('artwork-price').innerText = artwork.price;

        // Получаем комментарии
        const commentsResponse = await fetch(`http://localhost:3000/comments/${artworkId}`);
        const comments = await commentsResponse.json();
        const commentsList = document.getElementById('comments-list');

        comments.forEach(comment => {
            const li = document.createElement('li');
            li.innerText = `${comment.user_name}: ${comment.message}`;
            commentsList.appendChild(li);
        });

        // Обработчик формы добавления комментария
        const commentForm = document.getElementById('comment-form');
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value;
            const message = document.getElementById('comment-message').value;

            const newComment = await fetch(`http://localhost:3000/comments/${artworkId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: userName, message: message })
            });

            if (newComment.ok) {
                alert("Комментарий добавлен!");
                window.location.reload(); // Перезагружаем страницу, чтобы увидеть новый комментарий
            }
        });
    });
}
