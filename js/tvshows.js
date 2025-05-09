const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;

function popularShows() {
    axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=en-US&page=${page}`)
        .then(response => {
            const series = response.data.results;
            let output = '';

            series.forEach(series => {
                let poster = series.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${series.poster_path}` : '../images/default.webp';
                let year = series.first_air_date ? series.first_air_date.slice(0, 4) : 'N/A';

                output += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${poster}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${series.id}, 'tv');">
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                    </div>
                                    <div class="rating">
                                        <ion-icon name="star-outline"></ion-icon>
                                        <span>${series.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div class="play" onclick="viewDetails(${series.id}, 'tv');">
                                        <ion-icon name="play-circle-outline"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${series.name}</h3>
                                <div class="card-info">
                                    <span class="genre">Tv</span>
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
    popularShows();
    $('#loadMoreButton').click(() => popularShows());
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
