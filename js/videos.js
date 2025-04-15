document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5ec279387e9aa9488ef4d00b22acc451';
    const videosContainer = document.querySelector('.videos-container');
    const searchInput = document.querySelector('#search-input');
    const searchForm = document.querySelector('#search-form');
    const paginationContainer = document.querySelector('.pagination');
    const breadcrumb = document.querySelector('.breadcrumb');
    const videoModal = document.querySelector('#videoModal');
    const videoIframe = document.querySelector('#videoIframe');
    const closeModalButton = document.querySelector('#closeModal');
    const videoSlider = document.querySelector('#videoSlider');
    
    let currentPage = 1;
    let totalPages = 1;

    function fetchVideos(page = 1, query = '') {
        const url = query
            ? `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&page=${page}`
            : `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&page=${page}`;

        axios.get(url)
            .then((response) => {
                let results = response.data.results;
                totalPages = response.data.total_pages;

                results = results.filter(result => result.media_type === 'movie' || result.media_type === 'tv');

                if (results.length === 0) {
                    videosContainer.innerHTML = '<p>No videos found.</p>';
                } else {
                    displayVideos(results);
                    updatePagination();
                }
            })
            .catch((error) => {
                console.error('Error fetching videos:', error);
                videosContainer.innerHTML = '<p>Error loading videos. Please try again later.</p>';
            });
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchVideos(1, query);
            breadcrumb.innerHTML = `<li class="breadcrumb-item active">Search Results</li>`;
        }
    });

    function displayVideos(results) {
        videosContainer.innerHTML = '';

        results.forEach((result) => {
            const videoCard = createVideoCard(result);
            videosContainer.appendChild(videoCard);
        });
    }

    function createVideoCard(result) {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card live-card';
        videoCard.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${result.backdrop_path || result.poster_path || '/default.webp'}')`;
        videoCard.addEventListener('click', () => openPopup(result.id, result.media_type));

        videoCard.innerHTML = `
            <div class="card-body">
                <h5>${result.title || result.name || 'Untitled'}</h5>
            </div>
        `;
        return videoCard;
    }

    function openPopup(videoId, mediaType) {
        let url = mediaType === 'movie'
            ? `https://api.themoviedb.org/3/movie/${videoId}/videos?api_key=${apiKey}`
            : `https://api.themoviedb.org/3/tv/${videoId}/videos?api_key=${apiKey}`;

        axios.get(url)
            .then((response) => {
                const videos = response.data.results;
                if (videos.length) {
                    displayVideoSlider(videos);
                    videoIframe.src = `https://www.youtube.com/embed/${videos[0].key}`;
                    videoModal.style.display = 'flex';
                } else {
                    alert('No videos available for this item.');
                }
            })
            .catch((error) => {
                console.error('Error fetching video details:', error);
            });
    }

    function displayVideoSlider(videos) {
        videoSlider.innerHTML = '';

        videos.forEach((video) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail';
            thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${video.key}/hqdefault.jpg')`;
            thumbnail.addEventListener('click', () => {
                videoIframe.src = `https://www.youtube.com/embed/${video.key}`;
            });
            videoSlider.appendChild(thumbnail);
        });
    }

    closeModalButton.addEventListener('click', () => {
        videoModal.style.display = 'none';
        videoIframe.src = '';
    });

    function updatePagination() {
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.innerText = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchVideos(currentPage, searchInput.value.trim());
            }
        });

        paginationContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.innerText = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchVideos(currentPage, searchInput.value.trim());
            }
        });

        paginationContainer.appendChild(nextButton);
    }

    fetchVideos();
});