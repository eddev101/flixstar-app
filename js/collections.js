const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const collectionIds = [1241, 86311, 448150, 10, 263, 119, 121938, 295, 328, 531241, 748, 2344, 645, 8651, 9485, 87096, 528, 324552, 131635, 268, 137697, 87, 210511, 10194, 230, 36694, 152495, 8091, 261694, 8350];

function displayPredefinedCollections() {
    collectionIds.forEach(collectionId => fetchCollectionById(collectionId));
}

function fetchCollectionById(collectionId) {
    axios.get(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}&language=en-US`)
        .then(response => {
            const collection = response.data;
            let poster = collection.poster_path ? `https://image.tmdb.org/t/p/w300${collection.poster_path}` : "../images/default.webp";
            let output = `
                <a href="#" class="movie-box-link">
                    <div class="movie-box" onclick="window.location.href='collection-details.html?id=${collection.id}';">
                        <div class="movie-image-box">
                            <img src="${poster}" class="img-movies">
                        </div>
                        <div class="movie-description">
                            <div class="md-title"><h1>${collection.name}</h1></div>
                            <div class="md-desc">
                                <span>·</span>
                                <p>Movie Collection</p>
                            </div>
                        </div>
                    </div>
                </a>`;
            $('#collections').append(output);
        })
        .catch(error => console.log(error));
}

function searchCollections(query) {
    axios.get(`https://api.themoviedb.org/3/search/collection?api_key=${API_KEY}&language=en-US&query=${query}&page=1`)
        .then(response => {
            const collections = response.data.results;
            $('#collections').empty();
            if (collections.length > 0) {
                collections.forEach(collection => {
                    axios.get(`https://api.themoviedb.org/3/collection/${collection.id}?api_key=${API_KEY}&language=en-US`)
                        .then(detailsResponse => {
                            const parts = detailsResponse.data.parts;
                            const nonAdultMovies = parts.filter(movie => !movie.adult);
                            if (nonAdultMovies.length > 0) {
                                let poster = collection.poster_path ? `https://image.tmdb.org/t/p/w300${collection.poster_path}` : "../images/default.webp";
                                let output = `
                                    <a href="#" class="movie-box-link">
                                        <div class="movie-box" onclick="window.location.href='collection-details.html?id=${collection.id}';">
                                            <div class="movie-image-box">
                                                <img src="${poster}" class="img-movies">
                                            </div>
                                            <div class="movie-description">
                                                <div class="md-title"><h1>${collection.name}</h1></div>
                                                <div class="md-desc">
                                                    <span>·</span>
                                                    <p>Movie Collection</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>`;
                                $('#collections').append(output);
                            }
                        })
                        .catch(error => console.log(error));
                });
            } else {
                $('#collections').append('<p>No results found.</p>');
            }
        })
        .catch(error => console.log(error));
}

$(document).ready(() => {
    displayPredefinedCollections();
    $('#searchForm').on('submit', e => {
        e.preventDefault();
        let searchText = $('#searchText').val().trim();
        if (searchText) searchCollections(searchText);
        else {
            $('#collections').empty();
            displayPredefinedCollections();
        }
    });
    $('#searchText').on('input', function() {
        let searchText = $(this).val().trim();
        if (searchText) searchCollections(searchText);
        else {
            $('#collections').empty();
            displayPredefinedCollections();
        }
    });
});

document.getElementById('searchForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') event.preventDefault();
});