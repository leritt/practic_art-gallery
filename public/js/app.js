// app.js

// ---------- ГЛАВНАЯ СТРАНИЦА ----------
document.addEventListener("DOMContentLoaded", async () => {
    const artworkList = document.getElementById('artwork-list');

    if (artworkList) {
        // Загружаем все картины
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
    }
});

// ---------- СТРАНИЦА ОТДЕЛЬНОЙ КАРТИНЫ ----------
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    const title = document.getElementById('artwork-title');
    const image = document.getElementById('artwork-image');
    const description = document.getElementById('artwork-description');
    const price = document.getElementById('artwork-price');
    const status = document.getElementById('artwork-status');
    const buyBtn = document.getElementById('buy-btn');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');

    try {
        // Загрузка информации о картине
        const response = await fetch(`http://localhost:3000/artworks/${id}`);
        const artwork = await response.json();

        title.textContent = artwork.title;
        image.src = artwork.image_url;
        description.textContent = artwork.description;
        price.textContent = artwork.price + " $";
        status.textContent = artwork.is_sold ? "Продано" : "В наличии";

        if (artwork.is_sold) {
            buyBtn.disabled = true;
            buyBtn.textContent = "Продано";
        }

        // Обработка кнопки покупки
        buyBtn.addEventListener("click", async () => {
            console.log("Кнопка нажата");
            const confirmBuy = confirm("Вы уверены, что хотите купить эту картину?");
            if (!confirmBuy) return;

            const buyResponse = await fetch(`http://localhost:3000/buy/${id}`, {
                method: 'POST'
            });

            if (buyResponse.ok) {
                alert("Покупка прошла успешно!");
                buyBtn.disabled = true;
                buyBtn.textContent = "Продано";
                status.textContent = "Продано";
            } else {
                const result = await buyResponse.json();
                alert("Ошибка: " + result.error);
            }
        });

        // Загрузка комментариев
        const commentsResponse = await fetch(`http://localhost:3000/comments/${id}`);
        const comments = await commentsResponse.json();

        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = `${comment.user_name}: ${comment.message}`;
            commentsList.appendChild(li);
        });

        // Отправка комментария
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value.trim();
            const message = document.getElementById('comment-message').value.trim();

            if (!userName || !message) {
                alert("Заполните все поля!");
                return;
            }

            const commentResponse = await fetch(`http://localhost:3000/comments/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: userName, message })
            });

            if (commentResponse.ok) {
                alert("Комментарий добавлен!");
                window.location.reload(); // обновим страницу
            } else {
                alert("Ошибка при добавлении комментария");
            }
        });

    } catch (err) {
        console.error("Ошибка при загрузке картины:", err);
    }
});
