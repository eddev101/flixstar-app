const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) {
        console.error('favoritesGrid element not found');
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('Favorites contents:', favorites); // Debug log

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="text-center">No favorites added yet.</p>';
        return;
    }

    favorites.forEach(item => {
        console.log('Processing item:', item); // Debug log
        const endpoint = item.type === 'movie'
            ? `${TMDB_BASE_URL}movie/${item.id}?api_key=${API_KEY}`
            : `${TMDB_BASE_URL}tv/${item.id}?api_key=${API_KEY}`;

        axios.get(endpoint)
            .then(response => {
                const details = response.data;
                const card = document.createElement('a');
                card.href = '#';
                card.onclick = () => false;
                card.innerHTML = `
                    <div class="movie-card">
                        <div class="card-head">
                            <img src="${details.poster_path ? 'https://image.tmdb.org/t/p/w342' + details.poster_path : '/images/default.webp'}" class="card-img">
                            <div class="card-overlay">
                                <div class="bookmark" onclick="removeFromFavorites(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="close-outline"></ion-icon></div>
                                <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${details.vote_average.toString().substring(0, 3)}</span></div>
                                <div class="play" onclick="viewDetails(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="play-circle-outline"></ion-icon></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${details.title || details.name}</h3>
                            <div class="card-info">
                                <span class="genre">${item.type === 'movie' ? 'Movie' : 'Tv'}</span>
                                <span class="year">${(details.release_date || details.first_air_date || '').substring(0, 4) || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `;
                favoritesGrid.appendChild(card);
            })
            .catch(error => {
                console.error(`Error fetching ${item.type} ${item.id}:`, error);
                favoritesGrid.innerHTML += `<p>Error loading ${item.type} ${item.id}</p>`; // Fallback UI
            });
    });
});

function removeFromFavorites(id, type) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="text-center">No favorites added yet.</p>';
    } else {
        favoritesGrid.innerHTML = ''; // Clear and reload
        favorites.forEach(item => {
            const endpoint = item.type === 'movie' ? `${TMDB_BASE_URL}movie/${item.id}?api_key=${API_KEY}` : `${TMDB_BASE_URL}tv/${item.id}?api_key=${API_KEY}`;
            axios.get(endpoint).then(response => {
                const details = response.data;
                const card = document.createElement('a');
                card.href = '#';
                card.onclick = () => false;
                card.innerHTML = `
                    <div class="movie-card">
                        <div class="card-head">
                            <img src="${details.poster_path ? 'https://image.tmdb.org/t/p/w342' + details.poster_path : '/images/default.webp'}" class="card-img">
                            <div class="card-overlay">
                                <div class="bookmark" onclick="removeFromFavorites(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="close-outline"></ion-icon></div>
                                <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${details.vote_average.toString().substring(0, 3)}</span></div>
                                <div class="play" onclick="viewDetails(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="play-circle-outline"></ion-icon></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${details.title || details.name}</h3>
                            <div class="card-info">
                                <span class="genre">${item.type === 'movie' ? 'Movie' : 'Tv'}</span>
                                <span class="year">${(details.release_date || details.first_air_date || '').substring(0, 4) || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `;
                favoritesGrid.appendChild(card);
            }).catch(error => console.error(`Error reloading ${item.type} ${item.id}:`, error));
        });
    }
    alert('Item removed from favorites!');
}

function removeFromFavorites(id, type) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const originalLength = favorites.length;
    favorites = favorites.filter(item => !(item.id.toString() === id.toString() && item.type === type)); // Ensure string comparison
    if (favorites.length < originalLength) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<p class="text-center">No items in your favorites yet.</p>';
        } else {
            favoritesGrid.innerHTML = ''; // Clear and reload
            favorites.forEach(item => {
                const endpoint = item.type === 'movie' ? `${TMDB_BASE_URL}movie/${item.id}?api_key=${API_KEY}` : `${TMDB_BASE_URL}tv/${item.id}?api_key=${API_KEY}`;
                axios.get(endpoint).then(response => {
                    const details = response.data;
                    const card = document.createElement('a');
                    card.href = '#';
                    card.onclick = () => false;
                    card.innerHTML = `
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${details.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + details.poster_path : '/images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="removeFromFavorites(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="close-outline"></ion-icon></div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${details.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="play-circle-outline"></ion-icon></div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${details.title || details.name}</h3>
                                <div class="card-info">
                                    <span class="genre">${item.type === 'movie' ? 'Movie' : 'Tv'}</span>
                                    <span class="year">${(details.release_date || details.first_air_date || '').substring(0, 4) || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    favoritesGrid.appendChild(card);
                }).catch(error => console.error(`Error reloading ${item.type} ${item.id}:`, error));
            });
        }
        alert('Item removed from favorites!');
    } else {
        console.error('No matching item found to remove:', { id, type });
        alert('Failed to remove item. Please try again.');
    }
}

function viewDetails(id, type) {
    window.location.href = type === 'movie'
        ? `../movie/movie-details.html?id=${id}`
        : `../tvshow/tvshow-details.html?id=${id}`;
}

