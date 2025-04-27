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
            document.getElementById('movie-poster').src = movie.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}` : '../images/default.webp';
            document.getElementById('movie-poster').alt = movie.title;
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('movie-overview').textContent = movie.overview;

            let details = `
                <div class="text-primary-title">Released: <span class="text-body">${movie.release_date || 'N/A'}</span></div>
                <div class="text-primary-title">Duration: <span class="text-body">${movie.runtime ? movie.runtime + ' min' : 'N/A'}</span></div>
                <div class="text-primary-title">Genres: <span class="text-body">${movie.genres.slice(0, 3).map(g => g.name).join(', ') || 'N/A'}</span></div>
                <div class="text-primary-title">Rating: <span class="text-body"><ion-icon name="star" style="color: #f5c518 !important;"></ion-icon> ${movie.vote_average.toString().substring(0, 3)}</span></div>
                <div class="text-primary-title">Director: <span class="text-body">${movie.credits.crew.find(c => c.job === 'Director')?.name || 'N/A'}</span></div>
                <div class="text-primary-title">Producers: <span class="text-body">${movie.credits.crew.filter(c => c.job === 'Producer').map(p => p.name).join(', ') || 'N/A'}</span></div>`;
            $('#movie-details').html(details);

            let servers = `
                <a href="#" class="server-button btn" data-url="https://vidsrc.me/embed/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Vidsrc</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://www.2embed.cc/embed/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>2embed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://multiembed.mov/?video_id=${movie.id}&tmdb=1"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>SuperEmbed</h1></div></div></a>
                <a href="#" class="server-button btn" data-url="https://moviesapi.club/movie/${movie.id}"><div class="server"><div class="server-div1"><i class="fa fa-play"></i></div><div class="server-div2"><span>Server</span><h1>Moviesapi</h1></div></div></a>`;
            $('#movie-servers').html(servers);

            let cast = '';
            movie.credits.cast.slice(0, 10).forEach(c => { // Limit to 10 for performance
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
                                <img src="${r.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + r.poster_path : '../images/default.webp'}" class="card-img">
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

            
            //blocker
            (function() {
    const originalWindowOpen = window.open;
    window.open = function(url, name, features) {
        console.log('Blocked popup:', url);
        return null;
    };
})();
  // Blocker Script - Updated Version
(function() {
    const blockedUrls = [
        'cdn4ads.com',
        'youradexchange.com',
        'todayswigcontagious.com',
        'runative-syndicate.com',
        'mv.mgdinbd.top',
        'mgdinbd.top',
        'b5l1voyg8t.top',
        'web-surfing.fly.storage.tigris.dev',
        'clk.omgt4.com',
        'omgt4.com',
        'bobgames-prolister.com',
        'rdtk.io',
        'topsolutions.rdtk.io',
        'jiuwert.online',
        'trk.jiuwert.online',
        'madurird.com',
        'movenivalcrooffer.com',
        '19ad8.com',
        'wps.com',
        'sportsbet486.io',
        'opera.com',
        'fzyvmvomphvvws.com',
        'vidnextcdn.xyz',
        'vidmoly.to',
        'vidhidepro.com',
        'vidfast.co',
        'vidbem.com',
        'vidnext.net',
        'vidstream.pro',
        'spoutable.com',
        'adsco.re',
        'adtng.com',
        'ousnsd.com',
        'zeusadnet.com',
        'streamcdn.to',
        'snackly.co',
        'mobisla.com',
        'epom.com',
        'popcash.net',
        'adsterra.com',
        'clickadu.com',
        'propellerads.com',
        'push.house',
        'admaven.com',
        'yllix.com',
        'popads.net',
        'trafficjunky.com',
        'doubleclick.net',
        'googleadservices.com',
        'googlesyndication.com',
        'moatads.com',
        'outbrain.com',
        'taboola.com',
        'revenuehits.com',
        'content.ad',
        'cointraffic.io',
        'juicyads.com',
        'plugrush.com',
        'media.net',
        'adcash.com',
        'sharethrough.com',
        'optad360.io',
        'adpushup.com',
        'brightcom.com',
        'zergnet.com',
        'adhitz.com',
        'skimlinks.com',
        'pushnami.com',
        'vibrantmedia.com',
        'exoclick.com',
        'bc.vc',
        'shorte.st',
        'adf.ly',
        'linkvertise.com',
        'clicksgear.com',
        'displaytrust.com',
        'adhaven.media',
        'adtelligent.com',
        'pushbrothers.com',
        'pushworld.com',
        'smrtpop.com',
        'popmyads.com',
        'vungle.com',
        'inmobi.com',
        'tapjoy.com',
        'supersonicads.com',
        'saymedia.com',
        'matomy.com',
        'leadbolt.com',
        'airpush.com',
        'startapp.com',
        'mobvista.com',
        'appnext.com',
        'nend.net',
        'chartboost.com',
        'ironSource.mobi',
        'youappi.com',
        'globalhop.net',
        'adzmndr.com',
        'upapi.net',
        'fraudfilter.io',
        'bidgear.com',
        'casalemedia.com',
        'serving-sys.com',
        'mopub.com',
        'pubmatic.com',
        'openx.net',
        'rubiconproject.com',
        'appnexus.com',
        'adroll.com',
        'criteo.com',
        'triplelift.com',
        'sovrn.com',
        'gumgum.com',
        'stackadapt.com',
        'undertone.com',
        'kargo.com',
        'teads.tv',
        'mybestmv.com',
        'aniview.com',
        'newspops.net',
        'shadepush.com',
        'popunder.net',
        'smartadserver.com',
        'adhese.com',
        'epommarket.com',
        'mgid.com',
        'nativeads.com',
        'adskeeper.com',
        'monetag.com',
        'plexop.net',
        'surfem.com',
        'pushprofit.net',
        'adbuff.com',
        'braveadblock.com',
        'kickassads.io',
        'headway.co',
        'taptica.com',
        'sprout-ad.com',
        'adsby.bid',
        'trafficstars.com',
        'mgid.com',
        'redirectvoluum.com',
        'ntvads.com',
        '7search.com',
        'adsnative.com',
        'padstm.com',
        'casalmedia.com',
        'vidcloud9.com',
        'vidembed.cc',
        'vidcloud.icu',
        'videovard.su',
        'cdnaws.com',
        'upstream.to',
        'mwatchseries.com',
        'vidclouds.com',
        'mplayer.net',
        'vidnode.net',
        'movcloud.net',
        'vidoza.net',
        'streamtape.com',
        'filemoon.sx',
        'upcloud.cc',
        'streamwish.to',
        'filelions.com',
        'vidmoly.me',
        'vidhide.io',
        'vidsrc.me',
        'vidnextpro.com',
        'cinewhale.net',
        'theaterplus.com',
        'flixify.me',
        'megaflix.tv',
        'flixhq.net',
        'flixmovies.site',
        'cineb.net',
        'upmovies.to',
        'gomostream.com',
        'prmovies.net',
        'lookmovie.io',
        'watchserieshd.cc',
        'series9.to',
        'putlocker-is.cc',
        'solarmovie.pe',
        '123movieshub.to',
        'kissasian.sh',
        'watchcartoononline.bz',
        'trck.wargaming.net'
    ];

  
    // Block window.open popups
    const originalWindowOpen = window.open;
    window.open = function(url, name, features) {
        if (blockedUrls.some(blocked => url?.includes(blocked))) {
            console.warn('Blocked popup:', url);
            return null;
        }
        return originalWindowOpen.apply(this, arguments);
    };

    // Block fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (blockedUrls.some(blocked => args[0]?.toString().includes(blocked))) {
            console.warn('Blocked fetch request to:', args[0]);
            return new Promise(() => {}); // never resolves
        }
        return originalFetch.apply(this, args);
    };

    // Block XMLHttpRequest (older AJAX)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (blockedUrls.some(blocked => url?.includes(blocked))) {
            console.warn('Blocked XHR request to:', url);
            return; // cancel it
        }
        return originalXHROpen.apply(this, arguments);
    };

    // Block window.location redirects
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const originalHref = Object.getOwnPropertyDescriptor(Location.prototype, 'href');

    window.location.assign = function(url) {
        if (blockedUrls.some(blocked => url?.includes(blocked))) {
            console.warn('Blocked assign redirect:', url);
            return;
        }
        return originalAssign.apply(window.location, arguments);
    };

    window.location.replace = function(url) {
        if (blockedUrls.some(blocked => url?.includes(blocked))) {
            console.warn('Blocked replace redirect:', url);
            return;
        }
        return originalReplace.apply(window.location, arguments);
    };

    Object.defineProperty(window.location, 'href', {
        set: function(url) {
            if (blockedUrls.some(blocked => url?.includes(blocked))) {
                console.warn('Blocked href redirect:', url);
                return;
            }
            originalHref.set.call(window.location, url);
        },
        get: function() {
            return originalHref.get.call(window.location);
        }
    });

    // Block iframe source changes
    const originalIframeSrc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
    Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
        set: function(url) {
            if (blockedUrls.some(blocked => url?.includes(blocked))) {
                console.warn('Blocked iframe src:', url);
                return;
            }
            originalIframeSrc.set.call(this, url);
        },
        get: function() {
            return originalIframeSrc.get.call(this);
        }
    });

    // Block meta refresh redirects
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'META' && node.httpEquiv?.toLowerCase() === 'refresh') {
                    const content = node.content;
                    if (blockedUrls.some(blocked => content?.includes(blocked))) {
                        console.warn('Blocked meta refresh to:', content);
                        node.parentNode.removeChild(node);
                    }
                }
            }
        }
    });

    observer.observe(document.head || document.documentElement, { childList: true, subtree: true });

    // Bonus: Stop setTimeout based sneaky redirects
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(func, delay, ...args) {
        if (typeof func === 'string' && blockedUrls.some(blocked => func.includes(blocked))) {
            console.warn('Blocked setTimeout string redirect:', func);
            return;
        }
        return originalSetTimeout(func, delay, ...args);
    };

    console.log('%c[Blocker Activated] 🚫 Blocking ads and redirects...', 'color: limegreen; font-weight: bold;');
})();



            // Add event listeners AFTER DOM updates
            document.getElementById('playButton').addEventListener('click', () => {
                showIframe(`https://multiembed.mov/?video_id=${movie.id}&tmdb=1`); // Default server
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
        window.open(`https://m.vegamovies.ms/?s=${searchQuery}`, '_blank');
    } else {
        alert("Movie title not found!");
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
    if (!favorites.some(item => item.id === movieId && item.type === 'movie')) {
        favorites.push({ id: movieId, type: 'movie' });
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        alert('Added to favorites!');
    } else {
        alert('Already in favorites.');
    }
}

function addToWatchlist(id = movieId, type = 'movie') {
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
    window.location.href = `../movie/movie-details.html?id=${id}`;
}
