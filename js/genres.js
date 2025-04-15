const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';

function loadGenres() {
    // Fetch movie genres
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const movieGenres = response.data.genres;
            let movieOutput = '';
            movieGenres.forEach(genre => {
                axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc`)
                    .then(movieResponse => {
                        const firstMovie = movieResponse.data.results[0] || {};
                        const background = firstMovie.backdrop_path ? `https://image.tmdb.org/t/p/w500/${firstMovie.backdrop_path}` : '';
                        movieOutput += `
                            <div class="live-card" style="background-image: url('${background}'); background-size: cover; height: 200px;">
                                <div class="card-body" style="background-color: rgba(0, 0, 0, 0.2);">
                                    <div class="card-head">
                                        <h5 class="card-title">${genre.name}</h5>
                                    </div>
                                    <a href="genre-details.html?id=${genre.id}&type=movie" class="btn btn-primary live-card-btn">View Movies</a>
                                </div>
                            </div>`;
                        $('#movie-genres').html(movieOutput);
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));

    // Fetch TV show genres
    axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const tvGenres = response.data.genres;
            let tvOutput = '';
            tvGenres.forEach(genre => {
                axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc`)
                    .then(tvResponse => {
                        const firstTvShow = tvResponse.data.results[0] || {};
                        const background = firstTvShow.backdrop_path ? `https://image.tmdb.org/t/p/original/${firstTvShow.backdrop_path}` : '';
                        tvOutput += `
                            <div class="live-card" style="background-image: url('${background}'); background-size: cover; height: 200px;">
                                <div class="card-body" style="background-color: rgba(0, 0, 0, 0.2);">
                                    <div class="card-head">
                                        <h5 class="card-title">${genre.name}</h5>
                                    </div>
                                    <a href="genre-details.html?id=${genre.id}&type=tv" class="btn btn-primary live-card-btn">View TV Shows</a>
                                </div>
                            </div>`;
                        $('#tv-genres').html(tvOutput);
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));
}

document.addEventListener('DOMContentLoaded', loadGenres);