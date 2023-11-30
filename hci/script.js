// Event listener for the "See All Recipes" button
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

            // Create a container div for the recipes
            var containerDiv = document.createElement('div');
            containerDiv.className = 'recipe-container';

            // Loop through the recipes and create divs for each
            data.recipes.forEach(function (recipe, index) {
                // Create a div for each recipe
                var recipeDiv = document.createElement('div');
                recipeDiv.className = 'recipe-item';
                recipeDiv.textContent = recipe.name;

                // Append the recipe div to the container
                containerDiv.appendChild(recipeDiv);

                // Check if we need to start a new row
                if ((index + 1) % 2 === 0) {
                    // Add a line break after every two recipes
                    containerDiv.appendChild(document.createElement('br'));
                }
            });

            // Append the container div to the recipeList
            recipeList.appendChild(containerDiv);
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

// Additional functionality: Event listener for the "Submit" button
document.getElementById('enterButton').addEventListener('click', checkAllergenFreeRecipes);

// Function to check and display allergen-free recipes
async function checkAllergenFreeRecipes() {
    try {
        // Get the selected allergens
        var selectedAllergens = document.querySelectorAll('.selected');
        var allergenNames = Array.from(selectedAllergens).map(function (button) {
            return button.textContent.trim();
        });

        // Send the selected allergens to the server
        const response = await fetch('/checkAllergenFreeRecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ allergens: allergenNames }),
        });

        const data = await response.json();

        var recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        if (data.allergenFreeRecipes.length > 0) {
            var recipesDiv = document.querySelector('.good-recipes h2');
            recipesDiv.style.visibility = 'visible';

            data.allergenFreeRecipes.forEach(function (recipe) {
                var listItem = document.createElement('li');
                listItem.textContent = recipe.name;
                recipeList.appendChild(listItem);
            });
        } else {
            alert('No allergen-free recipes found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while checking allergen-free recipes: ' + error.message);
    }
}

// Function to fetch and display recipes based on selected allergens
async function fetchAndDisplayRecipes() {
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

        var title = document.getElementById('recipeTitle');
        title.textContent = `Here are some ${allergenNames.join(', ')}-free recipes for you!`;

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

// Update the click event for the "Enter" button to call the new function
document.getElementById('enterButton').addEventListener('click', fetchAndDisplayRecipes);
