const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

// Initialize the database connection
db.serialize(() => {
    // Add your database queries and routes here
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
