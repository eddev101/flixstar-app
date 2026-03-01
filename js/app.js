// Define your TMDB API key here
// Define your TMDB API key here
const API_KEY = '5ec279387e9aa9488ef4d00b22acc451'; // Updated with your TMDB API key

// Reusable render function (same as before, just takes different container)
function renderMovies(movies, containerSelector) {
    let output = '';

    movies.forEach(movie => {
        const poster = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` 
            : "images/default.webp";
        
        const year = movie.release_date 
            ? movie.release_date.slice(0, 4) 
            : 'N/A';

        output += `
    <a href="#" class="movie-card-wrapper" 
       data-type="movie"
       data-id="${movie.id}"
       data-backdrop="${movie.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path : ''}"
       data-title="${movie.title.replace(/"/g, '&quot;')}"
       data-year="${year}"
       data-rating="${movie.vote_average.toFixed(1)}"
       data-overview="${movie.overview ? movie.overview.replace(/"/g, '&quot;') : 'No description available.'}"
       onclick="return false;">
        <div class="movie-card continue-card">
                <div class="card-head" style="height: fit-content;">
                    <img src="${poster}" class="card-img" alt="${movie.title}">
                    <div class="card-overlay">
                        <div class="bookmark" onclick="addToWatchlist(${movie.id}); event.stopPropagation();">
                            <ion-icon name="bookmark-outline"></ion-icon>
                        </div>
                        <div class="rating">
                            <ion-icon name="star-outline"></ion-icon>
                            <span>${movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div class="play" onclick="viewMovieDetails(${movie.id}); event.stopPropagation();">
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

    $(containerSelector).html(output || '<p class="no-results">No movies found</p>');
}

// ────────────────────────────────────────────────

function loadTrendingMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US&page=1`;
    
    axios.get(url)
        .then(res => {
            const movies = res.data.results.slice(0, 18);
            renderMovies(movies, '#trending-movies');
            afterMoviesLoaded();
        })
        .catch(err => {
            console.error('Trending fetch failed:', err);
            $('#trending-movies').html('<p class="error">Failed to load trending movies</p>');
        });
}

function loadNowPlayingMovies() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
    
    axios.get(url)
        .then(res => {
            const movies = res.data.results.slice(0, 18);
            renderMovies(movies, '#now-playing');
            afterMoviesLoaded();
        })
        .catch(err => {
            console.error('Now playing fetch failed:', err);
            $('#now-playing').html('<p class="error">Failed to load now playing movies</p>');
        });
}

function loadTopRatedMovies() {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    
    axios.get(url)
        .then(res => {
            const movies = res.data.results.slice(0, 18);
            renderMovies(movies, '#top-rated');
            afterMoviesLoaded();
        })
        .catch(err => {
            console.error('Top rated fetch failed:', err);
            $('#top-rated').html('<p class="error">Failed to load top rated movies</p>');
        });
}

// ────────────────────────────────────────────────
// Load all sections when the page is ready
/*
$(document).ready(function() {
    // Optional: show loading placeholders
    $('#trending-movies, #now-playing, #top-rated').html('<div class="loading">Loading...</div>');

    // Load everything (you can also use Promise.all if you want to wait for all)
    loadTrendingMovies();
    loadNowPlayingMovies();
    loadTopRatedMovies();

    // OR: parallel loading with Promise.all
    /*
    Promise.all([
        axios.get(`https://api.themoviedb.org/3/trending/movie/day?...`),
        axios.get(`https://api.themoviedb.org/3/movie/now_playing?...`),
        axios.get(`https://api.themoviedb.org/3/movie/top_rated?...`)
    ]).then(([trend, now, top]) => {
        renderMovies(trend.data.results.slice(0,18), '#trending-movies');
        renderMovies(now.data.results.slice(0,18), '#now-playing');
        renderMovies(top.data.results.slice(0,18), '#top-rated');
    }).catch(err => console.error(err));
    *
});
*/
// Placeholder functions for watchlist and details (implement later)
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


function viewMovieDetails(movieId) {
    // Implement navigation to movie details (e.g., redirect or load dynamically)
    window.location.href = `movie/movie-details.html?id=${movieId}`;
}

// Placeholder for LOAD MORE functionality
function loadMoreMovies() {
    window.location.href = `movie/movie-list.html`;
}

// Home trending shows
function indextrendingshows() {
    axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=en-US&page=1&sort_by=popularity.desc`)
        .then(response => {
            let series = response.data.results.slice(0, 12);
            let output = '';
            $.each(series, (index, series) => {
                let poster = series.poster_path ? `https://image.tmdb.org/t/p/w780${series.poster_path}` : "images/default-bg.png";
                let year = series.first_air_date.slice(0, 4);
                output += `
    <a href="#" class="movie-card-wrapper"   // ← add this class for popup to detect
       data-type="tv"
       data-id="${series.id}"
       data-backdrop="${series.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + series.backdrop_path : ''}"
       data-title="${series.name.replace(/"/g, '&quot;')}"   // ← name instead of title
       data-year="${series.first_air_date ? series.first_air_date.slice(0,4) : 'N/A'}"
       data-rating="${series.vote_average.toFixed(1)}"
       data-overview="${series.overview ? series.overview.replace(/"/g, '&quot;') : 'No description available.'}"
       onclick="return false;">
        <div class="live-card continue-card">
            <div class="card-head" style="height: fit-content;">
                <img src="${poster}" alt="" class="card-img">
                <div class="live-badge">${series.vote_average.toString().substring(0, 3)}</div>
                <div class="total-viewers">${year}</div>
                <div class="play" onclick="viewTvShowDetails(${series.id});">
                    <ion-icon name="play-circle-outline"></ion-icon>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${series.name}</h3>
            </div>
        </div>
    </a>`;
            });
            $('#home-trendingshows').html(output);
            afterMoviesLoaded();
        })
        .catch(error => {
            console.log(error);
        });
}

// Home popular shows
function indexpopshows() {
    axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&language=en-US&page=1&sort_by=popularity.desc`)
        .then(response => {
            let series = response.data.results.slice(0, 12);
            let output = '';
            $.each(series, (index, series) => {
                let poster = series.poster_path ? `https://image.tmdb.org/t/p/w780${series.poster_path}` : "images/default-bg.png";
                let year = series.first_air_date.slice(0, 4);
                output += `
    <a href="#" class="movie-card-wrapper"   // ← add this class for popup to detect
       data-type="tv"
       data-id="${series.id}"
       data-backdrop="${series.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + series.backdrop_path : ''}"
       data-title="${series.name.replace(/"/g, '&quot;')}"   // ← name instead of title
       data-year="${series.first_air_date ? series.first_air_date.slice(0,4) : 'N/A'}"
       data-rating="${series.vote_average.toFixed(1)}"
       data-overview="${series.overview ? series.overview.replace(/"/g, '&quot;') : 'No description available.'}"
       onclick="return false;">
        <div class="live-card continue-card">
            <div class="card-head" style="height: fit-content;">
                <img src="${poster}" alt="" class="card-img">
                <div class="live-badge">${series.vote_average.toString().substring(0, 3)}</div>
                <div class="total-viewers">${year}</div>
                <div class="play" onclick="viewTvShowDetails(${series.id});">
                    <ion-icon name="play-circle-outline"></ion-icon>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${series.name}</h3>
            </div>
        </div>
    </a>`;
            });
            $('#home-popshows').html(output);
            afterMoviesLoaded();
        })
        .catch(error => {
            console.log(error);
        });
}

// ────────────────────────────────────────────────
// Streaming Platform TV Shows Sections
// ────────────────────────────────────────────────

//const REGION = 'US';  // Change to 'US' if you want US catalog

const PROVIDERS = {
    netflix:     '8',
    amazon_prime: '119',
    apple_tv:    '350',
    paramount:   '531',
    peacock:     '387'
};

function loadTvByProvider(providerKey, containerId) {
    const providerId = PROVIDERS[providerKey];
    if (!providerId) return;

    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}` +
                `&language=en-US` +
                `&sort_by=popularity.desc` +
                `&page=1` +
                `&with_watch_providers=${providerId}`;  // no watch_region

   /* const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}` +
                `&language=en-US` +
                `&sort_by=popularity.desc` +
                `&page=1` +
                `&watch_region=${REGION}` +
                `&with_watch_providers=${providerId}`;*/
    

    axios.get(url)
        .then(response => {
            let shows = response.data.results.slice(0, 20);
            let output = '';

            $.each(shows, (index, show) => {
                let poster = show.poster_path 
                    ? `https://image.tmdb.org/t/p/w780${show.poster_path}` 
                    : "images/default-bg.png";
                
                let year = show.first_air_date 
                    ? show.first_air_date.slice(0, 4) 
                    : 'N/A';

                output += `
    <a href="#" class="movie-card-wrapper"
       data-type="tv"
       data-id="${show.id}"
       data-backdrop="${show.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + show.backdrop_path : ''}"
       data-title="${show.name.replace(/"/g, '&quot;')}"
       data-year="${year}"
       data-rating="${show.vote_average.toFixed(1)}"
       data-overview="${show.overview ? show.overview.replace(/"/g, '&quot;') : 'No description available.'}"
       onclick="return false;">
        <div class="live-card continue-card">
            <div class="card-head" style="height: fit-content;">
                <img src="${poster}" alt="" class="card-img">
                <div class="live-badge">${show.vote_average.toString().substring(0, 3)}</div>
                <div class="total-viewers">${year}</div>
                <div class="play" onclick="viewTvShowDetails(${show.id});">
                    <ion-icon name="play-circle-outline"></ion-icon>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${show.name}</h3>
            </div>
        </div>
    </a>`;
            });

            $(containerId).html(output || '<p class="no-results">No shows found</p>');
            afterMoviesLoaded();  // refresh slider arrows
        })
        .catch(error => {
            console.error(`Error loading ${providerKey} shows:`, error);
            $(containerId).html('<p class="error">Failed to load</p>');
        });
}

// ────────────────────────────────────────────────
// Call these when page loads (e.g. in $(document).ready or your init function)




function viewTvShowDetails(seriesId) {
    // Implement navigation to TV show details
    window.location.href = `tvshow/tvshow-details.html?id=${seriesId}`;
}

// Call functions on page load
$(document).ready(function() {
    fetchMovies('now_playing');
    indextrendingshows();
    indexpopshows();
    loadTvByProvider('netflix',     '#netflix-shows');
    loadTvByProvider('amazon_prime', '#amazon-prime-shows');
    loadTvByProvider('apple_tv',    '#apple-tv-shows');
    loadTvByProvider('paramount',   '#paramount-shows');
    loadTvByProvider('peacock',     '#peacock-shows');
});


// Add to flixstar-app/www/js/app.js
function handleSearch(event) {
    event.preventDefault();
    const query = event.target.query.value;
    if (query) {
        window.location.href = `search/search.html?query=${encodeURIComponent(query)}`;
    }
}

// Add to flixstar-app/www/js/app.js
function fetchSliderItems() {
  // Fetch trending movies
  axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US&page=1`)
    .then(movieResponse => {
      // Fetch trending TV shows
      axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&language=en-US&page=1`)
        .then(tvResponse => {
          // Combine and shuffle movies and TV shows
          const movies = movieResponse.data.results;
          const tvShows = tvResponse.data.results;
          const combined = [...movies, ...tvShows];
          combined.sort(() => Math.random() - 0.5); // Shuffle
          const topItems = combined.slice(0, 6); // Top 6 items

          // Genre map
          const genreMap = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
            9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
            53: 'Thriller', 10752: 'War', 37: 'Western', 10759: 'Action & Adventure',
            10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
            10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
          };

          // Generate HTML for slider
          let output = '';
          topItems.forEach(item => {
            const isMovie = item.media_type === 'movie' || item.title;
            const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '';
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
            const title = item.title || item.name;
            const year = isMovie
              ? (item.release_date ? item.release_date.substring(0, 4) : 'N/A')
              : (item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A');
            const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
            const genre = item.genre_ids && item.genre_ids.length > 0 ? (genreMap[item.genre_ids[0]] || 'Unknown') : 'N/A';
            const overview = item.overview || '';

            output += `
              <div class="slide slick-bg s-bg" data-backdrop="${backdrop}" data-poster="${poster}">
                <div class="container-fluid position-relative h-100">
                  <div class="slider-inner h-100">
                    <div class="row align-items-center h-100">
                      <div class="col-xl-6 col-lg-12 col-md-12 con-tent">
                        <h1 class="slider-text big-title title text-uppercase" data-animation-in="fadeInLeft" data-delay-in="0.6">
                          ${title}
                        </h1>
                        <div class="d-flex align-items-center mb-3 home-extra-pops" data-animation-in="fadeInUp">
                          <span class="btn btn-secondary me-2 home-extra">${year}</span>
                          <span class="btn btn-warning me-2 home-extra">${rating}</span>
                          <span class="btn btn-primary home-extra">${genre}</span>
                        </div>
                        <p data-animation-in="fadeInUp">${overview}</p>
                        <div class="d-flex align-items-center r-mb-23 mt-4 sld-buttons" data-animation-in="fadeInUp" data-delay-in="1.2">
                          <a href="#" onclick="viewDetails(${item.id}, '${isMovie ? 'movie' : 'tv'}'); return false;" class="btn btn-hover iq-button sld-btn"><ion-icon name="play-outline" class="sld-ion"></ion-icon>Play</a>
                          <a href="#" onclick="addToWatchlist(${item.id}, '${isMovie ? 'movie' : 'tv'}'); return false;" class="btn btn-link sld-mylist-btn"><ion-icon name="add-outline" class="sld-mylist-ion"></ion-icon>My List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
          });
          $('#home-slider').html(output);

          // Initialize Slick slider
          $('#home-slider').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: false,
            dots: true,
            fade: true,
            cssEase: 'linear'
          });

          // Set background images for slides
          const slides = document.querySelectorAll(".slide.s-bg");
          slides.forEach(slide => {
            const isMobile = window.innerWidth <= 499;
            const background = isMobile ? slide.dataset.poster : slide.dataset.backdrop;
            slide.style.backgroundImage = `url(${background})`;
          });

          window.addEventListener("resize", () => {
            slides.forEach(slide => {
              const isMobile = window.innerWidth <= 499;
              const background = isMobile ? slide.dataset.poster : slide.dataset.backdrop;
              slide.style.backgroundImage = `url(${background})`;
            });
          });
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}

// Add to $(document).ready in app.js
$(document).ready(function() {
  //fetchMovies('now_playing');
  indextrendingshows();
  indexpopshows();
  fetchSliderItems(); // Add this line
  loadContinueWatching(); // 👈 ADD
  loadTrendingMovies();
  loadNowPlayingMovies();
  loadTopRatedMovies();
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




// Placeholder for viewDetails (to be implemented later)
function viewDetails(id, type) {
    if (type === 'movie') {
        window.location.href = `movie/movie-details.html?id=${id}`;
    } else if (type === 'tv') {
        window.location.href = `tvshow/tvshow-details.html?id=${id}`;
    }
}


//continue watching
function loadContinueWatching() {
   const section = document.getElementById('continue-watching-section');
const list = JSON.parse(localStorage.getItem('continueWatching')) || [];

if (!list.length) {
    section.style.display = 'none';
    $('#continue-watching-grid').html('');
    return;
}

section.style.display = 'block';


    let output = '';

    list.forEach(item => {
        const url = item.type === 'movie'
            ? `https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`
            : `https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`;

        axios.get(url).then(res => {
            const data = res.data;
            const poster = data.poster_path
                ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
                : 'images/default.webp';

            const title = data.title || data.name;
            const sub = item.type === 'tv'
                ? `S${item.season} • E${item.episode}`
                : 'Continue Watching';

            output += `
               <div class="movie-card continue-card">
                    <button class="remove-continue"
                        onclick="removeContinueWatching(${item.id}, '${item.type}')">
                        ✕
                    </button>
                    <div class="card-head" style="height: fit-content;">
                        <img src="${poster}" class="card-img">
                        <div class="card-overlay">
                            <div class="play" onclick="viewDetails(${item.id}, '${item.type}')">
                                <ion-icon name="play-circle-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${title}</h3>
                        <div class="card-info">
                            <span class="genre">${sub}</span>
                        </div>
                    </div>
                </div>
            `;

            $('#continue-watching-grid').html(output);
            afterMoviesLoaded();
        });
    });
}



window.removeContinueWatching = function (id, type) {
    let list = JSON.parse(localStorage.getItem('continueWatching')) || [];
    list = list.filter(item => !(String(item.id) === String(id) && item.type === type));
    localStorage.setItem('continueWatching', JSON.stringify(list));
    loadContinueWatching();
};


//newly added scroll
function scrollContinue(direction, button) {
    // Find the closest .movies-grid / .continue-grid sibling to the clicked button
    const container = button.closest('.continue-wrapper')
                           ?.querySelector('.movies-grid, .continue-grid');
    
    if (!container) return;

    const scrollAmount = 400; // pixels to scroll each click - adjust if needed

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Call this function after rendering each section (or on window resize/load)
function updateSliderArrows() {
    document.querySelectorAll('.continue-wrapper').forEach(wrapper => {
        const container = wrapper.querySelector('.movies-grid, .continue-grid');
        const leftBtn  = wrapper.querySelector('.slider-btn.left');
        const rightBtn = wrapper.querySelector('.slider-btn.right');

        if (!container || !leftBtn || !rightBtn) return;

        const canScrollLeft  = container.scrollLeft > 0;
        const canScrollRight = Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth;

        leftBtn.style.display  = canScrollLeft  ? 'flex' : 'none';
        rightBtn.style.display = canScrollRight ? 'flex' : 'none';
    });
}

// Attach the scroll function to all buttons (delegation - efficient)
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.slider-btn');
    if (!btn) return;

    const direction = btn.classList.contains('left') ? -1 : 1;
    scrollContinue(direction, btn);
});

// Update arrows when:
window.addEventListener('load', updateSliderArrows);
window.addEventListener('resize', updateSliderArrows);

// Also update after content is loaded (call this after each axios .then)
function afterMoviesLoaded() {
    setTimeout(updateSliderArrows, 300); // small delay for layout to settle
}

// Example: call it in your fetch/render functions
// e.g. in fetchTrendingMovies() .then(...)
afterMoviesLoaded();

// Same for now-playing, popular shows, etc.



// Floating preview
const popup = document.getElementById('movie-preview-popup');
const popupBackdrop = popup.querySelector('.preview-backdrop');
const popupTitle   = popup.querySelector('.preview-title');
const popupYear    = popup.querySelector('.preview-year');
const popupRating  = popup.querySelector('.preview-rating span');
const popupOverview = popup.querySelector('.preview-overview');
const btnWatch     = popup.querySelector('.btn-watch-now');
const btnWatchlist = popup.querySelector('.btn-add-watchlist');
const btnClose     = popup.querySelector('.preview-close');

let hideTimer = null;
const HIDE_DELAY = 180; // ms - small grace period

function showPreview(card) {
    if (hideTimer) clearTimeout(hideTimer);

    const rect = card.getBoundingClientRect();

    let left = rect.right + 20;
    if (left + 380 > window.innerWidth) {
        left = rect.left - 380 - 20;
    }

    let top = rect.top + 40;
    top = Math.max(20, Math.min(top, window.innerHeight - 540));

    popup.style.position = 'fixed';
    popup.style.left = left + 'px';
    popup.style.top  = top + 'px';

    const type = card.dataset.type || 'movie';  // default to movie if missing

// Fill content
popupBackdrop.style.backgroundImage = `url(${card.dataset.backdrop || ''})`;
popupTitle.textContent    = card.dataset.title   || 'No title';
popupYear.textContent     = card.dataset.year    || 'N/A';
popupRating.textContent   = card.dataset.rating  || '—';
popupOverview.textContent = card.dataset.overview || 'No description available.';

// New: show type
popup.querySelector('.preview-type').textContent = type === 'tv' ? 'TV Show' : 'Movie';

// Correct click handler based on type
if (type === 'tv') {
    btnWatch.onclick = () => viewTvShowDetails(card.dataset.id);
} else {
    btnWatch.onclick = () => viewMovieDetails(card.dataset.id);
}

btnWatchlist.onclick = () => addToWatchlist(card.dataset.id);  // assuming same for both

    popup.classList.add('active');
}

function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        popup.classList.remove('active');
    }, HIDE_DELAY);
}

function cancelHide() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}

// ────────────────────────────────────────────────

document.addEventListener('mouseover', e => {
    let card = e.target.closest('.movie-card-wrapper');
    // Also try inner card if wrapper class missing
    if (!card) card = e.target.closest('.continue-card')?.closest('a');

    if (card || popup.contains(e.target)) {
        if (card) showPreview(card);
        cancelHide();
    }
});

document.addEventListener('mouseout', e => {
    const related = e.relatedTarget;

    const wasOverCard   = e.target.closest('.movie-card-wrapper, .continue-card');
    const nowOverPopup  = related && popup.contains(related);
    const nowOverCard   = related && related.closest('.movie-card-wrapper, .continue-card');

    if (popup.classList.contains('active') && !nowOverPopup && !nowOverCard) {
        scheduleHide();
    }
});

// Popup itself keeps it alive
popup.addEventListener('mouseenter', cancelHide);
popup.addEventListener('mouseleave', scheduleHide);

// Close button
btnClose.addEventListener('click', () => {
    popup.classList.remove('active');
    cancelHide();
});





















