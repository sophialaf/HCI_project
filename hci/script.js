// Event listener for the "see all recipes" button
document.getElementById('all-rec-butt').addEventListener('click', displayAllRecipes);

// Function to fetch and display all recipes
async function displayAllRecipes() {
    try {
        // Send a request to the server to get all recipes
        const response = await fetch('/getAllRecipes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        var recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        if (data.recipes.length > 0) {
            var recipesDiv = document.querySelector('.good-recipes h2');
            recipesDiv.style.visibility = 'visible';

            data.recipes.forEach(function (recipe) {
                var listItem = document.createElement('li');
                listItem.textContent = recipe.name; // Use 'name' instead of 'title'
                recipeList.appendChild(listItem);
            });
        } else {
            alert('No recipes found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recipes.');
    }
}

// Function to toggle the selection of allergens
function toggleSelection(button) {
    button.classList.toggle("selected");
}

// Function to unselect all allergens and fetch recipes without selected allergens
async function unselectAll() {
    var selectedAllergens = document.querySelectorAll('.selected');
    var allergenNames = Array.from(selectedAllergens).map(function (button) {
        return button.textContent.trim();
    });

    try {
        // Send the selected allergens to the server
        const response = await fetch('/getRecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ allergens: allergenNames }),
        });

        const data = await response.json();

        var recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        if (data.recipes.length > 0) {
            var recipesDiv = document.querySelector('.good-recipes h2');
            recipesDiv.style.visibility = 'visible';

            data.recipes.forEach(function (recipe) {
                var listItem = document.createElement('li');
                listItem.textContent = recipe.name;
                recipeList.appendChild(listItem);
            });
        } else {
            alert('No recipes found without selected allergens.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recipes.');
    }

    // Unselect all allergen buttons
    var buttons = document.querySelectorAll('.selected');
    buttons.forEach(function (button) {
        button.classList.remove("selected");
    });
}

// Additional functionality: Event listener for the "Search" button
document.querySelector('.search-bar button').addEventListener('click', searchRecipes);

// Function to search recipes based on user input
async function searchRecipes() {
    var searchTerm = document.querySelector('.search-bar input').value.trim();

    if (searchTerm !== '') {
        try {
            // Send the search term to the server
            const response = await fetch('/searchRecipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm: searchTerm }),
            });

            const data = await response.json();

            var recipeList = document.getElementById('recipeList');
            recipeList.innerHTML = '';

            if (data.recipes.length > 0) {
                var recipesDiv = document.querySelector('.good-recipes h2');
                recipesDiv.style.visibility = 'visible';

                data.recipes.forEach(function (recipe) {
                    var listItem = document.createElement('li');
                    listItem.textContent = recipe.name;
                    recipeList.appendChild(listItem);
                });
            } else {
                alert('No recipes found for the search term.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching recipes.');
        }
    } else {
        alert('Please enter a search term.');
    }
}
