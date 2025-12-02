
const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
let page = 1;
const perPage = 20;

document.addEventListener('DOMContentLoaded', () => {
    loadImdbTopShows();
    document.getElementById('loadMoreButton').addEventListener('click', () => {
        page++;
        loadImdbTopShows();
    });
});

async function loadImdbTopShows() {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}tv/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
        const shows = response.data.results;
        const grid = document.getElementById('imdbTopShows');

        shows.forEach(show => {
            const card = document.createElement('a');
            card.href = '#';
            card.onclick = () => false;
            card.innerHTML = `
                <div class="movie-card">
                    <div class="card-head">
                        <img src="${show.poster_path ? 'https://image.tmdb.org/t/p/w342' + show.poster_path : '/images/default.webp'}" class="card-img" alt="${show.name}">
                        <div class="card-overlay">
                            <div class="bookmark" onclick="addToWatchlist(${show.id}, 'tv'); event.stopPropagation();"><ion-icon name="bookmark-outline"></ion-icon></div>
                            <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${show.vote_average.toFixed(1)}</span></div>
                            <div class="play" onclick="viewDetails(${show.id}, 'tv'); event.stopPropagation();"><ion-icon name="play-circle-outline"></ion-icon></div>
                          </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${show.name}</h3>
                        <div class="card-info">
                            <span class="year">${show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        if (shows.length < perPage || page >= response.data.total_pages) {
            document.getElementById('loadMoreButton').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching IMDb top TV shows:', error);
        document.getElementById('imdbTopShows').innerHTML += '<p class="text-center">Failed to load TV shows. Try again later.</p>';
    }
}

function addToWatchlist(id, type = 'tv') {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const item = { id: id.toString(), type };
    if (!watchlist.some(existingItem => existingItem.id === item.id && existingItem.type === item.type)) {
        watchlist.push(item);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Added to watchlist!');
    } else {
        alert('Already in watchlist.');
    }
}



function viewDetails(id, type) {
    window.location.href = `../tvshow/tvshow-details.html?id=${id}`;
}
