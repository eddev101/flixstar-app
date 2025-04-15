const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;

function loadTopRatedMovies() {
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`)
        .then(response => {
            const movies = response.data.results;
            let output = '';

            movies.forEach(movie => {
                let poster = movie.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}` : '../images/default.webp';
                let year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

                output += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${poster}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${movie.id}, 'movie');">
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                    </div>
                                    <div class="rating">
                                        <ion-icon name="star-outline"></ion-icon>
                                        <span>${movie.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div class="play" onclick="viewDetails(${movie.id}, 'movie');">
                                        <ion-icon name="play-circle-outline"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${movie.title}</h3>
                                <div class="card-info">
                                    <span class="genre">Movie</span>
                                    <span class="year">${year}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });

            $('#movies').append(output);
            page++;

            if (page > response.data.total_pages) {
                $('#loadMoreButton').hide();
            }
        })
        .catch(error => console.log(error));
}

$(document).ready(() => {
    loadTopRatedMovies();
    $('#loadMoreButton').click(() => loadTopRatedMovies());
});

function addToWatchlist(id, type) {
    console.log(`Add ${type} ${id} to watchlist`);
}

function viewDetails(id, type) {
    window.location.href = `../movie/movie-details.html?id=${id}`;
}