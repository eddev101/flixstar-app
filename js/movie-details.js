const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (!movieId || isNaN(movieId)) {
    document.body.innerHTML = '<div class="alert alert-danger">Invalid Movie ID</div>';
} else {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`)
        .then(response => {
            const movie = response.data;

            document.title = `Watch ${movie.title} - Flixstar`;
            document.getElementById('iq-watch').style.backgroundImage = `url(${movie.backdrop_path ? 'https://image.tmdb.org/t/p/original' + movie.backdrop_path : '../images/default.webp'})`;
            document.getElementById('movie-poster').src = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '../images/default.webp';
            document.getElementById('movie-poster').alt = movie.title;
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('movie-overview').textContent = movie.overview;

let details = `
    <div class="text-primary-title">Released: <span class="text-body">${movie.release_date || 'N/A'}</span></div>
    <div class="text-primary-title">Duration: <span class="text-body">${movie.runtime ? movie.runtime + ' min' : 'N/A'}</span></div>
    <div class="text-primary-title">Genres: <span class="text-body">${movie.genres.slice(0, 3).map(g => g.name).join(', ') || 'N/A'}</span></div>
    <div class="text-primary-title">Rating:
        <span class="text-body">
            <ion-icon name="star" style="color:#f5c518"></ion-icon>
            ${movie.vote_average.toString().substring(0, 3)}
        </span>
    </div>

     <div class="dir-text text-primary-title">Director:
        <span class="text-body dir-st">
            ${
                movie.credits.crew.find(c => c.job === 'Director')
                    ? `<a href="../person/person-details.html?id=${movie.credits.crew.find(c => c.job === 'Director').id}" class="person-link">
                        ${movie.credits.crew.find(c => c.job === 'Director').name}
                       </a>`
                    : 'N/A'
            }
        </span>
    </div>

    <div class="text-primary-title">
        Producers:
        <span class="text-body">
            ${movie.credits.crew
                .filter(c => c.job === 'Producer')
                .map(p => p.name)
                .join(', ') || 'N/A'}
        </span>
    </div>
`;

            $('#movie-details').html(details);

            let servers = `
                <a href="#" class="server-button btn" data-url="https://player.videasy.net/movie/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Videasy</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://vidsrc.me/embed/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Vidsrc</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://hnembed.cc/embed/movie/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>2embed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://multiembed.mov/?video_id=${movie.id}&tmdb=1"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>SuperEmbed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://player.vidplus.to/embed/movie/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Vidplus</h1></div></div></a>`;
            $('#movie-servers').html(servers);

            let cast = '';
            movie.credits.cast.slice(0, 10).forEach(c => { // Limit to 10 for performance
                cast += `
                    <div class="cast-item">
                        <div class="cast-info">
                            <img src="${c.profile_path ? 'https://image.tmdb.org/t/p/w342' + c.profile_path : '../images/default-user1.png'}" alt="${c.name}">
                            <p class="actor-name">${c.name}</p>
                            <p class="character-name">as ${c.character}</p>
                        </div>
                        <a href="../person/person-details.html?id=${c.id}" class="btn cast-btn">View Person</a>
                    </div>`;
            });
            $('#movie-cast').html(cast);

            let trailers = '';
            movie.videos.results.filter(v => v.type === 'Trailer').forEach(t => {
                trailers += `<button class="btn trailer-button" data-url="https://www.youtube.com/embed/${t.key}">${t.name}</button>`;
            });
            $('#movie-trailers').html(trailers || '<p>No trailers available.</p>');

            let recommendations = '';
            movie.recommendations.results.slice(0, 20).forEach(r => { // Limit to 20
                recommendations += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${r.poster_path ? 'https://image.tmdb.org/t/p/w342' + r.poster_path : '../images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${r.id}, 'movie');"><ion-icon name="bookmark-outline"></ion-icon></div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${r.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${r.id}, 'movie');"><ion-icon name="play-circle-outline"></ion-icon></div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${r.title}</h3>
                                <div class="card-info">
                                    <span class="genre">Movie</span><span class="year">${r.release_date ? r.release_date.substring(0, 4) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
            $('#movie-recommendations').html(recommendations || '<p>No recommendations available.</p>');

            
  // Blocker Script - Updated Version
(function() {
    let firstClick = true;

    const originalWindowOpen = window.open;
    window.open = function(url, name, features) {
        if (firstClick) {
            console.warn('Blocked first click popup:', url);
            return null;
        }
        return originalWindowOpen.call(window, url, name, features);
    };

    const observer = new MutationObserver(mutations => {
        if (!firstClick) return;

        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME' || node.tagName === 'SCRIPT') {
                        console.warn('Blocked injected iframe/script on first click:', node.src || node.innerHTML);
                        node.remove();
                    }
                });
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('click', () => {
        if (firstClick) {
            console.log('%c[First click ad blocked successfully]', 'color: green; font-weight: bold;');
            firstClick = false;
            observer.disconnect();
        }
    }, { once: true });
})();




            // Add event listeners AFTER DOM updates
            document.getElementById('playButton').addEventListener('click', () => {
                showIframe(`https://player.vidplus.to/embed/movie/${movie.id}`); // Default server
            });

            document.querySelectorAll('.trailer-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIframe(button.getAttribute('data-url'));
                });
            });

            document.querySelectorAll('.server-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIframe(button.getAttribute('data-url'));
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
            document.body.innerHTML = '<div class="alert alert-danger">Error fetching movie details.</div>';
        });
}

function showIframe(url) {
    const iframeContainer = document.getElementById('iframeContainer');
    const movieIframe = document.getElementById('movieIframe');
    const adblockMessage = document.getElementById('adblock-message');

    if (!iframeContainer || !movieIframe || !adblockMessage) {
        console.error('Iframe elements not found in HTML');
        return;
    }

    iframeContainer.style.display = 'block';
    movieIframe.src = url;
    adblockMessage.style.display = 'block';
    iframeContainer.scrollIntoView({ behavior: 'smooth' });

    // Log iframe load errors
    movieIframe.onerror = () => console.error(`Failed to load iframe URL: ${url}`);
}

function closeAdblockMessage() {
    document.getElementById('adblock-message').style.display = 'none';
}

document.getElementById('closeIframe')?.addEventListener('click', () => {
    const iframeContainer = document.getElementById('iframeContainer');
    const movieIframe = document.getElementById('movieIframe');
    iframeContainer.style.display = 'none';
    movieIframe.src = '';
});

function redirectToDownload(event) {
    event.preventDefault();
    const movieTitle = document.getElementById('movie-title').textContent.trim();
    if (movieTitle) {
        const searchQuery = encodeURIComponent(movieTitle);
        window.open(`https://1337x.to/search/${searchQuery}/1/`, '_system');
    } else {
        alert("Movie title not found!");
    }
}

function addToFavorites(id = movieId, type = 'movie') {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const item = { id: id.toString(), type }; // Ensure ID is a string
    if (!favorites.some(existingItem => existingItem.id === item.id && existingItem.type === item.type)) {
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Added to favorites!');
    } else {
        alert('Already in favorites.');
    }
}

function addToWatchlist(id = movieId, type = 'movie') {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const item = { id: id.toString(), type }; // Ensure ID is a string
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










