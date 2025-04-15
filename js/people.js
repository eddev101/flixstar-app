const API_KEY = '5ec279387e9aa9488ef4d00b22acc451';
let page = 1;

function loadPopularPeople() {
    axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`)
        .then(response => {
            const people = response.data.results; // Full TMDB response includes 'results'
            let output = '';

            people.forEach(person => {
                const profilePath = person.profile_path ? `https://image.tmdb.org/t/p/w780${person.profile_path}` : '../images/default-profile.png';

                output += `
                    <a href="#" class="movie-box-link">
                        <div class="movie-box" onclick="viewDetails(${person.id}, 'person')">
                            <div class="movie-image-box">
                                <img src="${profilePath}" class="img-movies" alt="${person.name}">
                            </div>
                            <div class="movie-description">
                                <div class="md-title">
                                    <h1>${person.name}</h1>
                                </div>
                                <div class="md-desc">Known for ${person.known_for_department}</div>
                            </div>
                        </div>
                    </a>`;
            });

            $('#people').append(output);
            page++;

            // Check total_pages from the full TMDB response
            if (page > response.data.total_pages) {
                $('#loadMoreButton').hide();
            }
        })
        .catch(error => console.log(error));
}

$(document).ready(() => {
    loadPopularPeople();
    $('#loadMoreButton').click(() => loadPopularPeople());
});

function viewDetails(id, type) {
    window.location.href = `../person/person-details.html?id=${id}`;
}