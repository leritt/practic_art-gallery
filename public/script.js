// Загрузка картин на главной странице
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/artworks');
  const artworks = await response.json();
  const gallery = document.getElementById('gallery');
  
  artworks.forEach(artwork => {
    const artworkDiv = document.createElement('div');
    artworkDiv.classList.add('artwork');
    artworkDiv.innerHTML = `
      <h3>${artwork.title}</h3>
      <p>${artwork.description}</p>
      <p>Цена: ${artwork.price} $</p>
      <p>Художник: ${artwork.artist}</p>
    `;
    gallery.appendChild(artworkDiv);
  });
});

// Отправка новой картины
const addArtworkForm = document.getElementById('addArtworkForm');
if (addArtworkForm) {
  addArtworkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newArtwork = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: document.getElementById('price').value,
      artist: document.getElementById('artist').value
    };
    
    await fetch('/api/artworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newArtwork)
    });
    
    window.location.href = 'index.html';
  });
}
