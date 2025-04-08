document.addEventListener("DOMContentLoaded", async () => {
    const artworkList = document.getElementById('artwork-list');
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Главная страница
    if (artworkList) {
        try {
            const response = await fetch('http://localhost:3000/artworks');
            const artworks = await response.json();

            artworks.forEach(artwork => {
                const artworkDiv = document.createElement('div');
                artworkDiv.classList.add('artwork');
                artworkDiv.innerHTML = `
                    <img src="${artwork.image_url}" alt="${artwork.title}">
                    <h3>${artwork.title}</h3>
                    <p>${artwork.price} $</p>
                    <p><strong>${artwork.is_sold ? 'Продано' : 'В наличии'}</strong></p>
                    <a href="artwork.html?id=${artwork.id}">Подробнее</a>
                `;
                artworkList.appendChild(artworkDiv);
            });
        } catch (err) {
            console.error("Ошибка при загрузке картин:", err);
        }
        return;
    }

    // Страница картины
    if (!id) return;

    const title = document.getElementById('artwork-title');
    const artist = document.getElementById('artwork-artist');
    const image = document.getElementById('artwork-image');
    const description = document.getElementById('artwork-description');
    const price = document.getElementById('artwork-price');
    const status = document.getElementById('artwork-status');
    const buyBtn = document.getElementById('buy-btn');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');

    try {
        const response = await fetch(`http://localhost:3000/artworks/${id}`);
        const artwork = await response.json();

        artist.textContent = artwork.artist;
        title.textContent = artwork.title;
        image.src = artwork.image_url;
        description.textContent = artwork.description;
        price.textContent = artwork.price + " $";
        status.textContent = artwork.is_sold ? "Продано" : "В наличии";

        if (artwork.is_sold) {
            status.textContent = "Продано";
            buyBtn.disabled = true;
            buyBtn.textContent = "Продано";
            buyBtn.classList.add('disabled'); // <- вот эта строка
        } else {
            status.textContent = "В наличии";
            buyBtn.classList.remove('disabled'); // на всякий случай
        }
        

        buyBtn.addEventListener("click", async () => {
            window.location.href = `purchase.html?id=${id}`;

            // if (buyResponse.ok) {
            //     alert("Покупка прошла успешно!");
            //     buyBtn.disabled = true;
            //     buyBtn.textContent = "Продано";
            //     status.textContent = "Продано";
            // } else {
            //     const result = await buyResponse.json();
            //     alert("Ошибка: " + result.error);
            // }
        });

        // Загрузка комментариев
        const commentsResponse = await fetch(`http://localhost:3000/comments/${id}`);
        const comments = await commentsResponse.json();

        comments.forEach(comment => {
            const li = document.createElement('li');
            li.innerText = `${comment.user_name}: ${comment.message}`;
            commentsList.appendChild(li);
        });

        // Обработка формы комментариев
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userName = document.getElementById('user-name').value.trim();
            const message = document.getElementById('comment-message').value.trim();

            if (!userName || !message) {
                alert("Заполните все поля!");
                return;
            }

            const newCommentResponse = await fetch(`http://localhost:3000/comments/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: userName, message: message })
            });

            if (newCommentResponse.ok) {
                const newComment = await newCommentResponse.json();
                const li = document.createElement('li');
                li.textContent = `${newComment.user_name}: ${newComment.message}`;
                commentsList.appendChild(li);
                commentForm.reset();
            } else {
                alert("Ошибка при добавлении комментария");
            }
        });

    } catch (err) {
        console.error("Ошибка при загрузке картины:", err);
    }
});
