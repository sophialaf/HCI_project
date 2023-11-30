const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get(['/*.html', '/*.css', '/*.js', '/*.jpg', '/*.jpeg'], (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Use the default flag OPEN_CREATE, which creates the database file if it doesn't exist
const db = new sqlite3.Database('./hci_database.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

let server = app.listen(port, function () {
    console.log("App server is running on port", port);
    console.log("To end, press Ctrl + C");
});

// Handle GET request to get all recipes
app.get('/getAllRecipes', (req, res) => {
    const query = `
        SELECT *
        FROM recipes
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('All recipes:', rows);
            res.json({ recipes: rows });
        }
    });
});
