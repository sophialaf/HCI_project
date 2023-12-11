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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

let server = app.listen(port, function () {
    console.log("App server is running on port", port);
    console.log("To end, press Ctrl + C");
});
/*------------------------------------------------------------------------------------------------------
Database connection
------------------------------------------------------------------------------------------------------*/
const db = new sqlite3.Database('./hci_database.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

/*------------------------------------------------------------------------------------------------------
Get all recipes
------------------------------------------------------------------------------------------------------*/
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
            const numberOfRecipes = rows.length;
            console.log(`all Selected ${numberOfRecipes} recipes:`);
            res.json({ recipes: rows });
        }
    });
});


/*------------------------------------------------------------------------------------------------------
Select receipes
------------------------------------------------------------------------------------------------------*/
app.post('/getRecipes', (req, res) => {
    const selectedAllergens = req.body.allergens;

    if (!selectedAllergens || selectedAllergens.length === 0) {
        // If no allergens selected, return all recipes
        const query = `
        SELECT *
        FROM recipes
    `;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                const numberOfRecipes = rows.length;
                console.log(`all Selected ${numberOfRecipes} recipes:`);
                res.json({ recipes: rows });
            }
        });
    } else {
        // If allergens selected, return recipes without those allergens
        const allergenNames = selectedAllergens.map(name => `'${name}'`).join(',');

        const query = `
            SELECT DISTINCT recipes.*
            FROM recipes
            WHERE id NOT IN (
                SELECT DISTINCT recipes.id
                FROM recipes
                JOIN allergens ON recipes.allergens LIKE '%' || allergens.allergen_name || '%'
                WHERE allergens.allergen_name IN (${allergenNames})
            )
        `;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                const numberOfRecipes = rows.length;
                console.log(`idk which this is either Selected ${numberOfRecipes} recipes:`);
                res.json({ recipes: rows });
                // console.log('Filtered recipes:', rows);
                res.json({ recipes: rows });
            }
        });
    }
});
