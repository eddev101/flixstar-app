const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;
let currentProvider = 'all';  // default: no filter (trending)
const REGION = 'US';  // change to 'TR' if preferred; 'US' usually has more results

function loadShows() {
    let url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=en-US&page=${page}`;

    if (currentProvider !== 'all') {
        // Use discover with provider filter
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}` +
              `&language=en-US` +
              `&sort_by=popularity.desc` +
              `&page=${page}` +
              `&watch_region=${REGION}` +
              `&with_watch_providers=${currentProvider}`;
    }

    axios.get(url)
        .then(response => {
            const series = response.data.results;
            let output = '';

            series.forEach(show => {
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
                                    <span class="genre">Tv</span>
                                    <span class="year">${year}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });

            $('#shows').append(output);

            // Hide load more if no more pages
            if (page >= response.data.total_pages) {
                $('#loadMoreButton').hide();
            } else {
                $('#loadMoreButton').show();
            }
        })
        .catch(error => {
            console.log(error);
            $('#shows').append('<p style="color:red; text-align:center;">Failed to load shows</p>');
        });
}

$(document).ready(() => {
    // Initial load
    loadShows();

    // Load more button
    $('#loadMoreButton').click(() => {
        page++;
        loadShows();
    });

    // Filter dropdown change
    $('#providerFilter').change(function() {
        currentProvider = $(this).val();
        page = 1;
        $('#shows').empty();  // clear current grid
        $('#loadMoreButton').show();
        loadShows();
    });
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
