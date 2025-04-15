document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Email validation (mimicking PHP regex)
        const emailPattern = /@gmail\.com$|@yahoo\.com$|@hotmail\.com$/;
        if (!emailPattern.test(email)) {
            registerMessage.innerHTML = '<p class="text-danger">Please use a valid email (e.g., @gmail.com, @yahoo.com, @hotmail.com).</p>';
            setTimeout(() => { registerMessage.innerHTML = ''; }, 3000);
            return;
        }

        // Simulate database with localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            registerMessage.innerHTML = '<p class="text-danger">Email already in use. Please try a different one.</p>';
            setTimeout(() => { registerMessage.innerHTML = ''; }, 3000);
            return;
        }

        // Simulate user creation
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password // In a real app, hash this (e.g., with bcrypt.js if adding a library)
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        registerMessage.innerHTML = '<p class="text-success">Registration successful! Redirecting to login...</p>';
        setTimeout(() => {
            window.location.href = '../user/login.html';
        }, 3000);
    });
});