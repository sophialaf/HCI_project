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
            console.log(`All selected ${numberOfRecipes} recipes:`);
            res.json({ recipes: rows });
        }
    });
});

/*------------------------------------------------------------------------------------------------------
Select recipes
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
                console.log(`All selected ${numberOfRecipes} recipes:`);
                res.json({ recipes: rows });
            }
        });
    } else {
        // If allergens selected, return recipes without those allergens
        const placeholders = selectedAllergens.map(() => '?').join(',');
        const query = `
            SELECT DISTINCT recipes.*
            FROM recipes
            WHERE id NOT IN (
                SELECT DISTINCT recipes.id
                FROM recipes
                JOIN allergens ON recipes.allergens LIKE '%' || allergens.allergen_name || '%'
                WHERE allergens.allergen_name IN (${placeholders})
            )
        `;

        db.all(query, selectedAllergens, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                const numberOfRecipes = rows.length;
                console.log(`Selected ${numberOfRecipes} recipes without allergens:`);
                res.json({ recipes: rows });
            }
        });
    }
});
// Your existing express.js code remains unchanged

/*------------------------------------------------------------------------------------------------------
Generate random recipes
------------------------------------------------------------------------------------------------------*/
app.get('/getRandomRecipes', (req, res) => {
    const count = req.query.count || 1; // Default to 1 recipe if 'count' is not provided

    // Your logic to fetch random recipes based on the count
    const query = `
        SELECT *
        FROM recipes
        ORDER BY RANDOM()
        LIMIT ${count}
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const numberOfRecipes = rows.length;
            console.log(`Selected ${numberOfRecipes} random recipes:`);
            res.json({ recipes: rows });
        }
    });
});

/*------------------------------------------------------------------------------------------------------
Login route
------------------------------------------------------------------------------------------------------*/
app.post('/login', (req, res) => {
    // Print all usernames and passwords from the "users" table
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('All Usernames and Passwords:', rows);

        const { uname, psw } = req.body;
        console.log('Received username:', uname);
        console.log('Received password:', psw);

        // Check the database for the user
        db.get('SELECT * FROM users WHERE username = ? AND password = ?', [uname, psw], (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log('Query Result:', row); // Log the result to the server console

            if (row) {
                modal.style.display = "none";
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid username or password');
            }
        });
    });
});

