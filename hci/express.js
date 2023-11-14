const express = require('express');
// const db = require('./db');
const app = express();
const path = require('path');
const PORT = 3000;

// Serve the home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve static files (html, css, js, images, etc.)
app.get(['/*.html', '/*.css', '/*.js', '/*.jpg', '/*.jpeg'], (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/recipes', (req, res) => {
    db.all('SELECT * FROM Recipes', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});
