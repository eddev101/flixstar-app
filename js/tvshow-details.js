const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');
let selectedSeason = 1;
let selectedEpisode = 1;

if (!tvShowId || isNaN(tvShowId)) {
    document.body.innerHTML = '<div class="alert alert-danger">Invalid Show ID</div>';
} else {
    axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`)
        .then(response => {
            const show = response.data;

            document.title = `Watch ${show.name} - Flixstar`;
            document.getElementById('iq-watch').style.backgroundImage = `url(${show.backdrop_path ? 'https://image.tmdb.org/t/p/original' + show.backdrop_path : '../images/default.webp'})`;
            document.getElementById('show-poster').src = show.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${show.poster_path}` : '../images/default.webp';
            document.getElementById('show-poster').alt = show.name;
            document.getElementById('show-name').textContent = show.name;
            document.getElementById('show-overview').textContent = show.overview;

            let details = `
                <div class="text-primary-title">Released: <span class="text-body">${show.first_air_date || 'N/A'}</span></div>
                <div class="text-primary-title">Seasons: <span class="text-body">${show.number_of_seasons} Seasons</span></div>
                <div class="text-primary-title">Genres: <span class="text-body">${show.genres.slice(0, 3).map(g => g.name).join(', ') || 'N/A'}</span></div>
                <div class="text-primary-title">Rating: <span class="text-body"><ion-icon name="star" style="color: #f5c518 !important;"></ion-icon> ${show.vote_average.toFixed(1)}</span></div>
                <div class="text-primary-title">Created By: <span class="text-body">${show.created_by.length ? show.created_by.map(c => c.name).join(', ') : 'N/A'}</span></div>`;
            $('#show-details').html(details);

            let servers = `
                <a href="#" class="server-button btn" data-url="https://vidsrc.me/embed/tv?tmdb=${show.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Vidsrc</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://www.2embed.cc/embedtv/${show.id}&s=1&e=1"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>2embed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://multiembed.mov?video_id=${show.id}&tmdb=1&s=1&e=1"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>SuperEmbed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://moviesapi.club/tv/${show.id}-1-1"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Moviesapi</h1></div></div></a>`;
            $('#show-servers').html(servers);

            let seasonOptions = '<option value="">Select a Season</option>';
            show.seasons.forEach(s => {
                seasonOptions += `<option value="${s.season_number}">Season ${s.season_number}</option>`;
            });
            $('#seasonDropdown').html(seasonOptions);

            let cast = '';
            show.credits.cast.slice(0, 10).forEach(c => { // Limit to 10
                cast += `
                    <div class="cast-item">
                        <div class="cast-info">
                            <img src="${c.profile_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + c.profile_path : '../images/default-user1.png'}" alt="${c.name}">
                            <p class="actor-name">${c.name}</p>
                            <p class="character-name">as ${c.character}</p>
                        </div>
                        <a href="../person/person-details.html?id=${c.id}" class="btn cast-btn">View Person</a>
                    </div>`;
            });
            $('#show-cast').html(cast);

            let trailers = '';
            show.videos.results.filter(v => v.type === 'Trailer').forEach(t => {
                trailers += `<button class="btn trailer-button" data-url="https://www.youtube.com/embed/${t.key}">${t.name}</button>`;
            });
            $('#show-trailers').html(trailers || '<p>No trailers available.</p>');

            let recommendations = '';
            show.recommendations.results.slice(0, 20).forEach(r => { // Limit to 20
                recommendations += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${r.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + r.poster_path : '../images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${r.id}, 'tv');"><ion-icon name="bookmark-outline"></ion-icon></div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${r.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${r.id}, 'tv');"><ion-icon name="play-circle-outline"></ion-icon></div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${r.name}</h3>
                                <div class="card-info">
                                    <span class="genre">Tv</span><span class="year">${r.first_air_date ? r.first_air_date.substring(0, 4) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
            $('#show-recommendations').html(recommendations || '<p>No recommendations available.</p>');



            //blocker
            (function() {
    // Block popups
    const originalWindowOpen = window.open;
    window.open = function(url, name, features) {
        console.log('Blocked popup:', url);
        return null;
    };
})();

(function() {
    // Initialize an array to store blocked URLs
    const blockedUrls = new Set();  // Using a Set to avoid duplicate domains

    // List of blocklist URLs
    const blocklistUrls = [
        'https://easylist.to/easylist/easylist.txt',  // EasyList (Ads)
        'https://www.malwaredomainlist.com/hostslist/hosts.txt',  // Badware (Malicious)
        'https://github.com/StevenBlack/hosts/raw/master/hosts',  // Malware and Ads Combined
        // Add more URLs here if you want
    ];

    // Function to fetch and parse blocklists
    const fetchBlocklist = async () => {
        for (let url of blocklistUrls) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                // Split text into lines, filter out empty lines, and add them to blockedUrls
                const externalBlocklist = text.split('\n')
                    .map(domain => domain.trim())
                    .filter(domain => domain && !domain.startsWith('#'))  // Skip comments
                    .forEach(domain => blockedUrls.add(domain));  // Add each domain to the Set
            } catch (error) {
                console.warn(`Failed to load blocklist from ${url}:`, error);
            }
        }
    };

    // Fetch blocklists on page load
    fetchBlocklist();

    // Block fetch requests to the blocked URLs
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (blockedUrls.has(args[0]?.toString())) {
            console.warn('Blocked fetch request to:', args[0]);
            return new Promise(() => {}); // Never resolves
        }
        return originalFetch.apply(this, args);
    };

    // Block XMLHttpRequest (useful for older sites)
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url, async, user, pass) {
            if (blockedUrls.has(url)) {
                console.warn('Blocked XMLHttpRequest to:', url);
                return; // Block the request
            }
            return originalOpen.apply(xhr, arguments);
        };
        return xhr;
    };
})();




            // Add event listeners AFTER DOM updates
            document.getElementById('playButton').addEventListener('click', () => {
                const url = `https://multiembed.mov?video_id=${tvShowId}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`; 
                console.log('Attempting to load:', url);
                showIframe(url);
            });

            document.getElementById('seasonDropdown').addEventListener('change', function () {
                selectedSeason = this.value;
                if (selectedSeason) {
                    axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`)
                        .then(response => {
                            const episodes = response.data.episodes;
                            let episodeList = '';
                            episodes.forEach(e => {
                                episodeList += `
                                    <div class="episode-item">
                                        <div class="episode-box">
                                            <div class="episode-image">
                                                <img src="${e.still_path ? 'https://image.tmdb.org/t/p/w500' + e.still_path : '../images/default.webp'}" class="episode-image" alt="Episode ${e.episode_number}">
                                            </div>
                                            <div class="episode-details">
                                                <h4>Episode ${e.episode_number}: ${e.name}</h4>
                                                <p>${e.overview ? e.overview.substring(0, 100) + '...' : 'No description available.'}</p>
                                                <a href="#" class="play-button" data-episode="${e.episode_number}">Play Episode</a>
                                            </div>
                                        </div>
                                    </div>`;
                            });
                            $('#episodeList').html(episodeList);
                            $('#episodesContainer').css('display', 'block');

                            document.querySelectorAll('.play-button').forEach(button => {
                                button.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    selectedEpisode = this.getAttribute('data-episode');
                                    updateServerLinks();
                                    loadEpisode();
                                });
                            });
                        })
                        .catch(error => console.log(error));
                } else {
                    $('#episodesContainer').css('display', 'none');
                }
            });

            // Moved event listeners here
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
            console.error('Error fetching show details:', error);
            document.body.innerHTML = '<div class="alert alert-danger">Error fetching show details.</div>';
        });
}

function updateServerLinks() {
    document.querySelectorAll('.server-button').forEach(server => {
        let baseUrl = server.dataset.url;
        if (baseUrl.includes('moviesapi.club')) {
            server.dataset.url = `https://moviesapi.club/tv/${tvShowId}-${selectedSeason}-${selectedEpisode}`;
        } else if (baseUrl.includes('2embed.cc')) {
            server.dataset.url = `https://www.2embed.cc/embedtv/${tvShowId}&s=${selectedSeason}&e=${selectedEpisode}`;
        } else if (baseUrl.includes('multiembed.mov')) {
            server.dataset.url = `https://multiembed.mov?video_id=${tvShowId}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`;
        } else if (baseUrl.includes('vidsrc.me')) {
            server.dataset.url = `https://vidsrc.me/embed/tv?tmdb=${tvShowId}&season=${selectedSeason}&episode=${selectedEpisode}`;
        }
    });
}

function loadEpisode() {
    const defaultServer = document.querySelector('.server-button');
    if (defaultServer) showIframe(defaultServer.dataset.url);
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

    movieIframe.onerror = () => console.error(`Failed to load iframe: ${url} - Possible embedding restriction or invalid URL`);
}



function closeAdblockMessage() {
    document.getElementById('adblock-message').style.display = 'none';
}

document.getElementById('closeIframe')?.addEventListener('click', () => {
    document.getElementById('iframeContainer').style.display = 'none';
    document.getElementById('movieIframe').src = '';
    closeAdblockMessage();
});

function redirectToDownload(event) {
    event.preventDefault();
    const seriesTitle = document.getElementById('show-name').textContent.trim();
    if (seriesTitle) {
        const searchQuery = encodeURIComponent(seriesTitle);
        window.open(`https://tvshows.ac/search/${searchQuery}`, '_blank');
    } else {
        alert("Series title not found!");
    }
}

function addToFavorites() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
        alert('Please log in to add to favorites.');
        window.location.href = '../user/login.html';
        return;
    }

    let favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
    if (!favorites.some(item => item.id === tvShowId && item.type === 'tv')) {
        favorites.push({ id: tvShowId, type: 'tv' });
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        alert('Added to favorites!');
    } else {
        alert('Already in favorites.');
    }
}

function addToWatchlist(id = tvShowId, type = 'tv') {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
        alert('Please log in to add to watchlist.');
        window.location.href = '../user/login.html';
        return;
    }

    let watchlist = JSON.parse(localStorage.getItem(`watchlist_${user.id}`)) || [];
    if (!watchlist.some(item => item.id === id && item.type === type)) {
        watchlist.push({ id, type });
        localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(watchlist));
        alert('Added to watchlist!');
    } else {
        alert('Already in watchlist.');
    }
}
function viewDetails(id, type) {
    if (type === 'movie') {
        window.location.href = `../movie/movie-details.html?id=${id}`;
    } else if (type === 'tv') {
        window.location.href = `../tvshow/tvshow-details.html?id=${id}`;
    }
}
