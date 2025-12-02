const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;

function loadTopRatedShows() {
    axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`)
        .then(response => {
            const shows = response.data.results;
            let output = '';

            shows.forEach(show => {
                let poster = show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : '../images/default.webp';
                let year = show.first_air_date ? show.first_air_date.slice(0, 4) : 'N/A';

                output += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${poster}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${show.id}, 'tv');">
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                    </div>
                                    <div class="rating">
                                        <ion-icon name="star-outline"></ion-icon>
                                        <span>${show.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div class="play" onclick="viewDetails(${show.id}, 'tv');">
                                        <ion-icon name="play-circle-outline"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${show.name}</h3>
                                <div class="card-info">
                                    <span class="genre">TV Show</span>
                                    <span class="year">${year}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });

            $('#shows').append(output);
            page++;

            if (page > response.data.total_pages) {
                $('#loadMoreButton').hide();
            }
        })
        .catch(error => console.log(error));
}

$(document).ready(() => {
    loadTopRatedShows();
    $('#loadMoreButton').click(() => loadTopRatedShows());
});

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

