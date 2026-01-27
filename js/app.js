// Define your TMDB API key here
// Define your TMDB API key here
const API_KEY = '5ec279387e9aa9488ef4d00b22acc451'; // Updated with your TMDB API key

function fetchMovies(filter) {
    let apiUrl;

    if (filter === 'now_playing') {
        apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US&page=1`;
    } else if (filter === 'popular') {
        apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
    } else if (filter === 'newest') {
        apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`;
    }

    axios.get(apiUrl)
        .then(response => {
            let movies = response.data.results.slice(0, 18);
            let output = '';
            movies.forEach(movie => {
                let poster = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : "images/default.webp";
                let year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
                output += `
                    <a href="#" onclick="return false;">
                    <div class="movie-card">
                        <div class="card-head">
                            <img src="${poster}" class="card-img">
                            <div class="card-overlay">
                                <div class="bookmark" onclick="addToWatchlist(${movie.id});"><ion-icon name="bookmark-outline"></ion-icon></div>
                                <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${movie.vote_average.toString().substring(0, 3)}</span></div>
                                <div class="play" onclick="viewMovieDetails(${movie.id});"><ion-icon name="play-circle-outline"></ion-icon></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${movie.title}</h3>
                            <div class="card-info">
                                <span class="genre">Latest</span><span class="year">${year}</span>
                            </div>
                        </div>
                    </div></a>`;
            });
            $('#home-movies').html(output);
        })
        .catch(error => {
            console.log(error);
        });
}

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
                let poster = series.backdrop_path ? `https://image.tmdb.org/t/p/w780${series.backdrop_path}` : "images/default-bg.png";
                let year = series.first_air_date.slice(0, 4);
                output += `
                    <a href="#" onclick="return false;">
                    <div class="live-card">
                        <div class="card-head">
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
                let poster = series.backdrop_path ? `https://image.tmdb.org/t/p/w780${series.backdrop_path}` : "images/default-bg.png";
                let year = series.first_air_date.slice(0, 4);
                output += `
                    <a href="#" onclick="return false;">
                    <div class="live-card">
                        <div class="card-head">
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
        })
        .catch(error => {
            console.log(error);
        });
}

function viewTvShowDetails(seriesId) {
    // Implement navigation to TV show details
    window.location.href = `tvshow/tvshow-details.html?id=${seriesId}`;
}

// Call functions on page load
$(document).ready(function() {
    fetchMovies('now_playing');
    indextrendingshows();
    indexpopshows();
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
  fetchMovies('now_playing');
  indextrendingshows();
  indexpopshows();
  fetchSliderItems(); // Add this line
  loadContinueWatching(); // 👈 ADD
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
    const list = JSON.parse(localStorage.getItem('continueWatching')) || [];
    if (!list.length) return;

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
                <div class="movie-card">
                    <div class="card-head">
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
        });
    });
}


