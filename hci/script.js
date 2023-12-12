/*------------------------------------------------------------------------------------------------------
Toggle buttons
------------------------------------------------------------------------------------------------------*/
function toggleSelection(button) {
    button.classList.toggle("selected");
}

function unselectAll() {
    var buttons = document.querySelectorAll('.selected');
    buttons.forEach(function (button) {
        button.classList.remove("selected");
    });
}

/*------------------------------------------------------------------------------------------------------
Displaying all recipes
------------------------------------------------------------------------------------------------------*/
// Additional functionality: Event listener for the "See All Recipes" button
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

/*------------------------------------------------------------------------------------------------------
Generate random recipes
------------------------------------------------------------------------------------------------------*/
document.getElementById('enterButton').addEventListener('click', generateRandomRecipes);

async function generateRandomRecipes() {
    try {
        // Get a random count, you can adjust this logic based on your requirements
        const count = Math.floor(Math.random() * 10) + 1; // Generates a random number between 1 and 10

        // Send a request to the server to get a random set of recipes with the specified count
        const response = await fetch(`/getRandomRecipes?count=${count}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        var recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        var recipesDiv = document.querySelector('.good-recipes h2');

        if (data.recipes.length > 0) {
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
            recipesDiv.style.visibility = 'visible';
            recipesDiv.textContent = "You cannot eat today.";
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recipes.');
    }
}
