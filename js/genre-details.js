const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;

// Get genre ID and type from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const genreId = urlParams.get('id');
const type = urlParams.get('type') === 'movie' || urlParams.get('type') === 'tv' ? urlParams.get('type') : 'movie';

if (!genreId || isNaN(genreId)) {
    document.body.innerHTML = '<div class="alert alert-danger">Invalid genre ID</div>';
} else {
    document.getElementById('genre-title').textContent = type === 'movie' ? 'Movies in This Genre' : 'TV Shows in This Genre';

    function loadGenreContent() {
        const url = type === 'movie'
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
            : `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;

        axios.get(url)
            .then(response => {
                const items = response.data.results;
                let output = '';

                items.forEach(item => {
                    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : '../images/default.webp';
                    const year = item.release_date ? item.release_date.slice(0, 4) : (item.first_air_date ? item.first_air_date.slice(0, 4) : 'N/A');
                    output += `
                        <a href="#" onclick="return false;">
                            <div class="movie-card">
                                <div class="card-head">
                                    <img src="${poster}" class="card-img">
                                    <div class="card-overlay">
                                        <div class="bookmark" onclick="addToWatchlist(${item.id}, '${type}');">
                                            <ion-icon name="bookmark-outline"></ion-icon>
                                        </div>
                                        <div class="rating">
                                            <ion-icon name="star-outline"></ion-icon>
                                            <span>${item.vote_average.toFixed(1)}</span>
                                        </div>
                                        <div class="play" onclick="viewDetails(${item.id}, '${type}');">
                                            <ion-icon name="play-circle-outline"></ion-icon>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title">${item.title || item.name}</h3>
                                    <div class="card-info">
                                        <span class="genre">${type === 'movie' ? 'Movie' : 'TV Show'}</span>
                                        <span class="year">${year}</span>
                                    </div>
                                </div>
                            </div>
                        </a>`;
                });

                document.getElementById('movies').insertAdjacentHTML('beforeend', output);
                page++;

                if (page > response.data.total_pages) {
                    document.getElementById('loadMoreButton').style.display = 'none';
                }
            })
            .catch(error => console.log(error));
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadGenreContent();
        document.getElementById('loadMoreButton').addEventListener('click', loadGenreContent);
    });
}

function addToWatchlist(id, type) {
    console.log(`Add ${type} ${id} to watchlist`);
}

function viewDetails(id, type) {
    if (type === 'movie') {
        window.location.href = `../movie/movie-details.html?id=${id}`;
    } else if (type === 'tv') {
        window.location.href = `../tvshow/tvshow-details.html?id=${id}`;
    }
}