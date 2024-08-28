
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.get('/check_auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.user });
});

// Add routes for login, logout, etc.

app.listen(3000, () => console.log('Server running on port 3000'));
