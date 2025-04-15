document.addEventListener('DOMContentLoaded', () => {
    // Clear user data from storage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    // Update message and redirect
    document.getElementById('logoutMessage').innerHTML = '<p class="text-success">Logout successful! Redirecting...</p>';
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
});