document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
  
    // === ГЛАВНАЯ СТРАНИЦА (index.html) ===
    const artworkList = document.getElementById("artwork-list");
    if (artworkList) {
      try {
        const response = await fetch("http://localhost:3000/artworks");
        const artworks = await response.json();
  
        artworks.forEach((artwork) => {
          const artworkDiv = document.createElement("div");
          artworkDiv.classList.add("artwork");
          artworkDiv.innerHTML = `
            <img src="${artwork.image_url}" alt="${artwork.title}">
            <h3>${artwork.title}</h3>
            <p>${artwork.price} $</p>
            <p><strong>${artwork.is_sold ? "Продано" : "В наличии"}</strong></p>
            <a href="artwork.html?id=${artwork.id}">Подробнее</a>
          `;
          artworkList.appendChild(artworkDiv);
        });
      } catch (err) {
        console.error("Ошибка при загрузке картин:", err);
      }
      return;
    }
  
    // === СТРАНИЦА КАРТИНЫ (artwork.html) ===
    const title = document.getElementById("artwork-title");
    if (title && id) {
      const artist = document.getElementById("artwork-artist");
      const image = document.getElementById("artwork-image");
      const description = document.getElementById("artwork-description");
      const price = document.getElementById("artwork-price");
      const status = document.getElementById("artwork-status");
      const buyBtn = document.getElementById("buy-btn");
      const commentsList = document.getElementById("comments-list");
      const commentForm = document.getElementById("comment-form");
  
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
          buyBtn.disabled = true;
          buyBtn.textContent = "Продано";
          buyBtn.classList.add("disabled");
        } else {
          buyBtn.classList.remove("disabled");
        }
  
        buyBtn.addEventListener("click", () => {
          window.location.href = `purchase.html?id=${id}`;
        });
  
        // Комментарии
        const commentsResponse = await fetch(`http://localhost:3000/comments/${id}`);
        const comments = await commentsResponse.json();
  
        comments.forEach((comment) => {
          const li = document.createElement("li");
          li.innerText = `${comment.user_name}: ${comment.message}`;
          commentsList.appendChild(li);
        });
  
        // Добавление комментария
        commentForm.addEventListener("submit", async (e) => {
          e.preventDefault();
  
          const userName = document.getElementById("user-name").value.trim();
          const message = document.getElementById("comment-message").value.trim();
  
          if (!userName || !message) {
            alert("Заполните все поля!");
            return;
          }
  
          const newCommentResponse = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_name: userName, message: message }),
          });
  
          if (newCommentResponse.ok) {
            const newComment = await newCommentResponse.json();
            const li = document.createElement("li");
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
  
      return;
    }
  
    // === СТРАНИЦА ОФОРМЛЕНИЯ ПОКУПКИ (purchase.html) ===
    const purchaseForm = document.getElementById("purchase-form");
    if (purchaseForm && id) {
      const artworkIdField = document.getElementById("artwork-id");
      if (artworkIdField) artworkIdField.value = id;
  
      purchaseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const data = {
          name: purchaseForm.fullname.value,
          address: purchaseForm.address.value,
          phone: purchaseForm.phone.value,
          delivery_method: purchaseForm.delivery.value,
          comment: purchaseForm.note.value,
        };
  
        const confirmBuy = confirm("Подтвердить заказ?");
        if (!confirmBuy) return;
  
        try {
          const res = await fetch(`http://localhost:3000/buy/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
  
          if (res.ok) {
            alert("Покупка успешно оформлена!");
            window.location.href = `artwork.html?id=${id}`;
          } else {
            const result = await res.json();
            alert("Ошибка: " + result.error);
          }
        } catch (err) {
          console.error("Ошибка при оформлении заказа:", err);
          alert("Произошла ошибка при отправке данных.");
        }
      });
    }
  });
  