const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';

// Get collection ID from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const collectionId = urlParams.get('id');

if (!collectionId || isNaN(collectionId) || collectionId <= 0) {
    document.body.innerHTML = '<div class="alert alert-danger">Invalid collection ID.</div>';
} else {
    axios.get(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const collection = response.data;

            // Update page title
            document.title = `Watch ${collection.name} - Flixstar`;

            // Update background and content
            document.getElementById('iq-watch').style.backgroundImage = `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})`;
            document.getElementById('collection-poster').src = collection.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${collection.poster_path}` : '../images/default.webp';
            document.getElementById('collection-name').textContent = collection.name;
            document.getElementById('collection-overview').textContent = collection.overview;

            // Populate movies grid
            let output = '';
            collection.parts.forEach(movie => {
                output += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movie.poster_path : '../images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${movie.id}, 'movie');"><ion-icon name="bookmark-outline"></ion-icon></div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${movie.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${movie.id}, 'movie');"><ion-icon name="play-circle-outline"></ion-icon></div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${movie.title}</h3>
                                <div class="card-info">
                                    <span class="genre">Movie</span><span class="year">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
            $('#collection-movies').html(output);
        })
        .catch(error => {
            console.log(error);
            document.body.innerHTML = '<div class="alert alert-danger">Error fetching collection details. Please try again later.</div>';
        });
}

// Reuse functions from app.js (or redefine if needed)
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
