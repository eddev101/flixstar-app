
const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
let page = 1;
const perPage = 20;

document.addEventListener('DOMContentLoaded', () => {
    loadImdbTopMovies();
    document.getElementById('loadMoreButton').addEventListener('click', () => {
        page++;
        loadImdbTopMovies();
    });
});

async function loadImdbTopMovies() {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
        const movies = response.data.results;
        const grid = document.getElementById('imdbTopMovies');

        movies.forEach(movie => {
            const card = document.createElement('a');
            card.href = `/movie/movie-details.html?id=${movie.id}`;
            card.className = 'movie-card-link';
            card.innerHTML = `
                <div class="movie-card">
                    <div class="card-head">
                        <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movie.poster_path : '/images/default.webp'}" class="card-img" alt="${movie.title}">
                        <div class="card-overlay">
                            <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${movie.vote_average.toFixed(1)}</span></div>
                            <div class="play"><ion-icon name="play-circle-outline"></ion-icon></div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${movie.title}</h3>
                        <div class="card-info">
                            <span class="year">${movie.release_date.substring(0, 4) || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        if (movies.length < perPage) {
            document.getElementById('loadMoreButton').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching IMDb top movies:', error);
        document.getElementById('imdbTopMovies').innerHTML += '<p class="text-center">Failed to load movies. Try again later.</p>';
    }
}
