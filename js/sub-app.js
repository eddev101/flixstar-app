function handleSearch(event) {
    event.preventDefault();
    const query = event.target.query.value;
    if (query) {
        window.location.href = `../search/search.html?query=${encodeURIComponent(query)}`;
    }
}