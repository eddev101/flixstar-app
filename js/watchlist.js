const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

document.addEventListener('DOMContentLoaded', () => {
    const watchlistGrid = document.getElementById('watchlistGrid');
    // Remove user check if no login is required
    // const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Use global watchlist if no user

    if (!watchlistGrid) {
        console.error('watchlistGrid element not found');
        return;
    }

    if (watchlist.length === 0) {
        watchlistGrid.innerHTML = '<p class="text-center">No items in your watchlist yet.</p>';
        return;
    }

    watchlist.forEach(item => {
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
                            <img src="${details.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + details.poster_path : '/images/default.webp'}" class="card-img">
                            <div class="card-overlay">
                                <div class="bookmark" onclick="removeFromWatchlist(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="close-outline"></ion-icon></div>
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
                watchlistGrid.appendChild(card);
            })
            .catch(error => {
                console.error(`Error fetching ${item.type} ${item.id}:`, error);
                watchlistGrid.innerHTML += `<p>Error loading ${item.type} ${item.id}</p>`; // Fallback UI
            });
    });
});

function removeFromWatchlist(id, type) {
    // Remove user check if no login
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    const watchlistGrid = document.getElementById('watchlistGrid');
    if (watchlist.length === 0) {
        watchlistGrid.innerHTML = '<p class="text-center">No items in your watchlist yet.</p>';
    } else {
        watchlistGrid.innerHTML = ''; // Clear and reload
        watchlist.forEach(item => {
            // Recreate cards (simplified, could optimize with DOM diff)
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
                                <div class="bookmark" onclick="removeFromWatchlist(${item.id}, '${item.type}'); event.stopPropagation();"><ion-icon name="close-outline"></ion-icon></div>
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
                watchlistGrid.appendChild(card);
            }).catch(error => console.error(`Error reloading ${item.type} ${item.id}:`, error));
        });
    }
    alert('Item removed from watchlist!'); // User feedback
}

function viewDetails(id, type) {
    window.location.href = type === 'movie'
        ? `/movie/movie-details.html?id=${id}`
        : `/tvshow/tvshow-details.html?id=${id}`;
}
