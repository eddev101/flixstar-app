document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Check registered users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password); // Plaintext check for simplicity

        if (user) {
            const userData = { id: user.id, email: user.email };
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }
            loginMessage.innerHTML = '<p class="text-success">Login successful!</p>';
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            loginMessage.innerHTML = '<p class="text-danger">Login failed. Please check your credentials.</p>';
        }
    });
});