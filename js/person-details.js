const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const urlParams = new URLSearchParams(window.location.search);
const personId = urlParams.get('id');
let fullBiography = '';
let shortBiography = '';

if (!personId || isNaN(personId)) {
    document.body.innerHTML = '<div class="alert alert-danger">Invalid Person ID</div>';
} else {
    axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const person = response.data;

            document.title = `${person.name} Profile - Watch Free Movies Online | Flixstar | Download HD Movies and Tv Shows`;
            document.getElementById('person-profile').src = person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '../images/default.webp';
            document.getElementById('person-profile').alt = person.name;
            document.getElementById('person-name').textContent = person.name;
            document.getElementById('person-birthday').textContent = person.birthday || 'N/A';
            document.getElementById('person-birthplace').textContent = person.place_of_birth || 'N/A';

            fullBiography = person.biography || 'No biography available.';
            shortBiography = fullBiography.length > 200 ? fullBiography.substring(0, 200) + '...' : fullBiography;
            document.getElementById('biography').textContent = shortBiography;
            if (fullBiography.length > 200) {
                document.getElementById('readMoreBtn').style.display = 'inline';
            }
        })
        .catch(error => {
            console.log(error);
            document.body.innerHTML = '<div class="alert alert-danger">Error fetching person details.</div>';
        });

    axios.get(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const credits = response.data;

            let actingOutput = '';
            const filteredCast = credits.cast.filter(credit => !credit.adult);
            filteredCast.forEach(credit => {
                actingOutput += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${credit.poster_path ? 'https://image.tmdb.org/t/p/w780' + credit.poster_path : '../images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${credit.id}, '${credit.media_type}');">
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                    </div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${credit.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${credit.id}, '${credit.media_type}');">
                                        <ion-icon name="play-circle-outline"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${credit.title || credit.name}</h3>
                                <div class="card-info">
                                    <span class="genre">${credit.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
                                    <span class="year">${credit.release_date ? credit.release_date.substring(0, 4) : (credit.first_air_date ? credit.first_air_date.substring(0, 4) : 'N/A')}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
            $('#acting-credits').html(actingOutput);

            let crewOutput = '';
            const filteredCrew = credits.crew.filter(credit => !credit.adult);
            filteredCrew.forEach(credit => {
                crewOutput += `
                    <a href="#" onclick="return false;">
                        <div class="movie-card">
                            <div class="card-head">
                                <img src="${credit.poster_path ? 'https://image.tmdb.org/t/p/w780' + credit.poster_path : '../images/default.webp'}" class="card-img">
                                <div class="card-overlay">
                                    <div class="bookmark" onclick="addToWatchlist(${credit.id}, '${credit.media_type}');">
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                    </div>
                                    <div class="rating"><ion-icon name="star-outline"></ion-icon><span>${credit.vote_average.toString().substring(0, 3)}</span></div>
                                    <div class="play" onclick="viewDetails(${credit.id}, '${credit.media_type}');">
                                        <ion-icon name="play-circle-outline"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${credit.title || credit.name} (${credit.department})</h3>
                                <div class="card-info">
                                    <span class="genre">${credit.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
                                    <span class="year">${credit.release_date ? credit.release_date.substring(0, 4) : (credit.first_air_date ? credit.first_air_date.substring(0, 4) : 'N/A')}</span>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
            $('#crew-credits').html(crewOutput);
        })
        .catch(error => console.log(error));
}

function toggleBiography() {
    const biographyText = document.getElementById('biography');
    const readMoreBtn = document.getElementById('readMoreBtn');

    if (readMoreBtn.innerHTML === 'Read More') {
        biographyText.textContent = fullBiography;
        readMoreBtn.innerHTML = 'Show Less';
    } else {
        biographyText.textContent = shortBiography;
        readMoreBtn.innerHTML = 'Read More';
    }
}

function addToWatchlist(id, type) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const item = { id: id.toString(), type }; // Ensure ID is a string
    if (!watchlist.some(existingItem => existingItem.id === item.id && existingItem.type === item.type)) {
        watchlist.push(item);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`Added ${type === 'movie' ? 'movie' : 'TV show'} to watchlist!`);
    } else {
        alert(`This ${type === 'movie' ? 'movie' : 'TV show'} is already in your watchlist.`);
    }
}

function viewDetails(id, type) {
    if (type === 'movie') {
        window.location.href = `../movie/movie-details.html?id=${id}`;
    } else if (type === 'tv') {
        window.location.href = `../tvshow/tvshow-details.html?id=${id}`;
    }
}
