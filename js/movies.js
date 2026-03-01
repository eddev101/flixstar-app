const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;
let currentFilters = {
    genre: '',
    year: '',
    sort: 'popularity.desc',
    provider: '',
    country: '',
    rating: '0'
};
const REGION = 'US'; // or 'TR' — US has more provider data

function loadMovies(reset = false) {
    if (reset) {
        page = 1;
        $('#movies').empty();
        $('#loadMoreButton').show();
    }

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}`;

    if (currentFilters.genre)    url += `&with_genres=${currentFilters.genre}`;
    if (currentFilters.year)     url += `&primary_release_year=${currentFilters.year}`;
    if (currentFilters.provider) url += `&watch_region=${REGION}&with_watch_providers=${currentFilters.provider}`;
    if (currentFilters.country)  url += `&with_origin_country=${currentFilters.country}`;
    if (currentFilters.rating > 0) url += `&vote_average.gte=${currentFilters.rating}`;
    
    url += `&sort_by=${currentFilters.sort}`;

    axios.get(url)
        .then(response => {
            const movies = response.data.results;
            let output = '';

            movies.forEach(movie => {
                let poster = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '../images/default.webp';
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

            if (page >= response.data.total_pages || movies.length === 0) {
                $('#loadMoreButton').hide();
            }
        })
        .catch(error => {
            console.log(error);
            $('#movies').append('<p style="color:red; text-align:center;">Failed to load movies</p>');
        });
}

// Fill year dropdown dynamically (1950 to current year)
function fillYearDropdown() {
    const select = $('#yearFilter');
    const currentYear = new Date().getFullYear();
    select.append('<option value="">Any</option>');
    for (let y = currentYear; y >= 1950; y--) {
        select.append(`<option value="${y}">${y}</option>`);
    }
}

$(document).ready(() => {
    fillYearDropdown();

    // Initial load
    loadMovies();

    // Load more
    $('#loadMoreButton').click(() => {
        page++;
        loadMovies();
    });

    // Filter changes
    $('#genreFilter, #yearFilter, #sortFilter, #providerFilter, #countryFilter, #ratingFilter').change(function() {
        currentFilters = {
            genre:    $('#genreFilter').val(),
            year:     $('#yearFilter').val(),
            sort:     $('#sortFilter').val(),
            provider: $('#providerFilter').val(),
            country:  $('#countryFilter').val(),
            rating:   $('#ratingFilter').val()
        };
        loadMovies(true); // reset = true
    });

    // Reset button
    $('#resetFilters').click(() => {
        $('#genreFilter').val('');
        $('#yearFilter').val('');
        $('#sortFilter').val('popularity.desc');
        $('#providerFilter').val('');
        $('#countryFilter').val('');
        $('#ratingFilter').val('0');

        currentFilters = {
            genre: '', year: '', sort: 'popularity.desc', provider: '', country: '', rating: '0'
        };

        loadMovies(true);
    });
});

function addToWatchlist(id, type = 'movie') {
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
    window.location.href = `../movie/movie-details.html?id=${id}`;
}
