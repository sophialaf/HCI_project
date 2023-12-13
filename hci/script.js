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

// Add an array to store selected allergens
var selectedAllergensArray = [];

function toggleSelection(button) {
    button.classList.toggle("selected");

    // Get the name of the allergen from the button's text content
    var allergenName = button.textContent.trim();

    // Toggle the allergen in the array
    if (selectedAllergensArray.includes(allergenName)) {
        // Remove allergen if already selected
        selectedAllergensArray = selectedAllergensArray.filter(name => name !== allergenName);
    } else {
        // Add allergen if not selected
        selectedAllergensArray.push(allergenName);
    }

    // Update the content of the selectedAllergens div
    updateSelectedAllergens();
}

// Function to update the content of the selectedAllergens div
function updateSelectedAllergens() {
    var selectedAllergensDiv = document.getElementById('recipeTitle');

    // Display the selected allergens
    if (selectedAllergensArray.length > 0) {
        selectedAllergensDiv.textContent = 'Here are some recipes without: ' + selectedAllergensArray.join(', ');
    } else {
        selectedAllergensDiv.textContent = 'You selected: None';
    }
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

                // Create a heart icon for each recipe
                var heartIcon = document.createElement('span');
                heartIcon.className = 'heart-icon';
                heartIcon.innerHTML = '&#x2665;'; // Unicode for a heart symbol
                recipeDiv.appendChild(heartIcon);

                // Add click event listener to the recipe div
                recipeDiv.addEventListener('click', function () {
                    // Toggle the 'liked' class on click
                    heartIcon.classList.toggle('liked');

                    // Change heart color on click
                    if (heartIcon.classList.contains('liked')) {
                        heartIcon.style.color = 'red';
                    } else {
                        heartIcon.style.color = 'black';
                    }
                });

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

                // Create a heart icon for each recipe
                var heartIcon = document.createElement('span');
                heartIcon.className = 'heart-icon';
                heartIcon.innerHTML = '&#x2665;'; // Unicode for a heart symbol
                recipeDiv.appendChild(heartIcon);

                // Add click event listener to the recipe div
                recipeDiv.addEventListener('click', function () {
                    // Toggle the 'liked' class on click
                    heartIcon.classList.toggle('liked');

                    // Change heart color on click
                    if (heartIcon.classList.contains('liked')) {
                        heartIcon.style.color = 'red';
                    } else {
                        heartIcon.style.color = 'black';
                    }
                });

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
    document.getElementById('selectedAllergens').style.visibility = 'visible';
}

/* -----------------------------------------------------------------------------------------------------
Login Form
-----------------------------------------------------------------------------------------------------*/
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('uname').value;
        const password = document.getElementById('psw').value;

        // Send a request to the server for authentication
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uname: username, psw: password }),
        })
            .then(response => {
                if (response.ok) {
                    // Login successful
                    return response.text(); // Extract the response text
                } else {
                    // Login failed
                    throw new Error('Invalid username or password');
                }
            })
            .then(message => {
                // Display success message in a pop-up
                alert(message);
                // You can redirect or perform other actions as needed
            })
            .catch(error => {
                // Display error message in a pop-up
                alert(error.message);
            });
    });
});
