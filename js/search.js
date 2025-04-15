const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');
let page = urlParams.get('page') && !isNaN(urlParams.get('page')) && urlParams.get('page') > 0 ? parseInt(urlParams.get('page')) : 1;
const maxPages = 5; // Limit to 5 pages as per original PHP

if (!query) {
    $('#search-results').html('<p>Please provide a search query.</p>');
} else {
    let allResults = [];
    let currentPage = page;

    function fetchResults() {
        if (currentPage > maxPages) {
            displayResults();
            return;
        }

        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${currentPage}`)
            .then(response => {
                if (response.data.results) {
                    allResults = allResults.concat(response.data.results);
                }
                currentPage++;
                if (currentPage <= response.data.total_pages && currentPage <= maxPages) {
                    fetchResults(); // Fetch next page
                } else {
                    displayResults();
                }
            })
            .catch(error => {
                console.log(error);
                $('#search-results').html('<p>Error fetching search results.</p>');
            });
    }

    function displayResults() {
        let output = '';
        if (allResults.length > 0) {
            allResults.forEach(result => {
                const imagePath = result.poster_path || result.profile_path;
                const title = result.title || result.name || 'Untitled';
                const year = (result.release_date || result.first_air_date || '').substring(0, 4) || 'N/A';
                const mediaType = result.media_type === 'movie' ? 'Movie' : result.media_type === 'tv' ? 'TV Show' : 'Person';

                output += `
                    <a href="#" class="movie-box-link">
                        <div class="movie-box" onclick="viewDetails(${result.id}, '${result.media_type}')">
                            <div class="movie-image-box">
                                <img src="${imagePath ? 'https://image.tmdb.org/t/p/w780' + imagePath : '../images/default.webp'}" class="img-movies" alt="${title}">
                            </div>
                            <div class="movie-description">
                                <div class="md-title">
                                    <h1>${title}</h1>
                                </div>
                                <div class="md-desc">
                                    ${year !== 'N/A' ? `<p>${year}</p><span>·</span>` : ''}
                                    <p>${mediaType}</p>
                                </div>
                            </div>
                        </div>
                    </a>`;
            });
        } else {
            output = '<p>No results found for your query.</p>';
        }
        $('#search-results').html(output);
    }

    fetchResults();
}

function viewDetails(id, type) {
    if (type === 'movie') {
        window.location.href = `../movie/movie-details.html?id=${id}`;
    } else if (type === 'tv') {
        window.location.href = `../tvshow/tvshow-details.html?id=${id}`;
    } else if (type === 'person') {
        window.location.href = `../person/person-details.html?id=${id}`;
    }
}