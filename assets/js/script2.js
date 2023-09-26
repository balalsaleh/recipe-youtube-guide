const apiKey = '1'; 
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php';

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const categoryContainer = document.getElementById('categoryContainer');
const recipeDetailsContainer = document.getElementById('recipeDetails'); 

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm.length >= 3) {
        fetchSuggestions(searchTerm);
    } else {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = ''; 
    }
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    fetchRecipes(searchTerm);
});

// api for displaying categories
function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            displayCategories(data.categories);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

function displayCategories(categories) {
    const categoryHeading = document.createElement('h2');
    categoryHeading.textContent = 'You can click on a category below for recipe ideas:';
    categoryContainer.appendChild(categoryHeading);

    const categoryGrid = document.createElement('div');
    categoryGrid.classList.add('row');

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('col-md-3', 'mb-4', 'category-card');

        const categoryImage = document.createElement('img');
        categoryImage.src = category.strCategoryThumb;
        categoryImage.alt = category.strCategory;
        categoryImage.classList.add('card-img-top');

        const categoryCardBody = document.createElement('div');
        categoryCardBody.classList.add('card-body');

        const categoryTitle = document.createElement('h5');
        categoryTitle.classList.add('card-title');
        categoryTitle.textContent = category.strCategory;

        categoryCardBody.appendChild(categoryTitle);
        categoryCard.appendChild(categoryImage);
        categoryCard.appendChild(categoryCardBody);

        categoryCard.addEventListener('click', () => {
            categoryContainer.innerHTML = '';

            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => card.classList.remove('active'));

            categoryCard.classList.add('active');

            fetchRecipesByCategory(category.strCategory);
        });

        categoryGrid.appendChild(categoryCard);
    });

    categoryContainer.appendChild(categoryGrid);
}

window.onload = () => {
    fetchCategories();
};

function fetchSuggestions(searchTerm) {
    const url = `${baseUrl}?s=${searchTerm}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            recipeSuggestions(data.meals);
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function recipeSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    if (!suggestions) {
        suggestionsContainer.classList.remove('show'); 
        return;
    }

    const amountOfSuggestions = 5;
    for (let i = 0; i < Math.min(suggestions.length, amountOfSuggestions); i++) {
        const suggestion = suggestions[i];

        const suggestionItem = document.createElement('button');
        suggestionItem.classList.add('dropdown-item');
        suggestionItem.textContent = suggestion.strMeal;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion.strMeal;
            suggestionsContainer.classList.remove('show'); 
            fetchRecipes(suggestion.strMeal);
        });

        suggestionsContainer.appendChild(suggestionItem);
    }

    suggestionsContainer.classList.add('show'); 
}

function fetchRecipes(searchTerm) {
    recipeDetailsContainer.innerHTML = '';
    const url = `${baseUrl}?s=${searchTerm}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.meals);
        });
}

function fetchRecipesByCategory(category) {
    categoryContainer.innerHTML = '';
    recipeDetailsContainer.innerHTML = '';
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.meals);
        });
}


function displayRecipes(recipes) {
    categoryContainer.innerHTML = '';
    resultsContainer.innerHTML = '';

    if (!recipes) {
        resultsContainer.textContent = 'No recipes found.';
        return;
    }

    const row = document.createElement('div');
    row.classList.add('row');

    recipes.forEach(recipe => {
        const recipeCol = document.createElement('div');
        recipeCol.classList.add('col-md-4', 'mb-3');

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('card');

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.strMealThumb;
        recipeImage.alt = recipe.strMeal;
        recipeImage.classList.add('card-img-top');

        const recipeCardBody = document.createElement('div');
        recipeCardBody.classList.add('card-body');

        const recipeLink = document.createElement('a');
        recipeLink.href = '#';
        recipeLink.textContent = recipe.strMeal;
        recipeLink.classList.add('card-title');

        recipeLink.addEventListener('click', () => {
            displayRecipeDetails(recipe.idMeal);
        });

        recipeCardBody.appendChild(recipeLink);
        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(recipeCardBody);
        recipeCol.appendChild(recipeCard);
        row.appendChild(recipeCol);
    });

    resultsContainer.appendChild(row);
}

function displayRecipeDetails(recipeId) {
    recipeDetailsContainer.innerHTML = '';

    resultsContainer.innerHTML = '';
    suggestionsContainer.innerHTML = '';

    const detailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

    fetch(detailsUrl)
        .then(response => response.json())
        .then(data => {
            const recipeDetails = data.meals[0];
            const ingredientsList = getIngredientsList(recipeDetails);
            const recipeDetailsHTML = `
                <div class="card">
                <h2 class="card-title"><strong>${recipeDetails.strMeal}</strong></h2>
                    <img src="${recipeDetails.strMealThumb}" alt="${recipeDetails.strMeal}" class="card-img-top" style="max-height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <p class="card-text"><strong>Instructions:</strong> ${recipeDetails.strInstructions}</p>
                        <p class="card-text"><strong>Category:</strong> ${recipeDetails.strCategory}</p>
                        <p class="card-text"><strong>Origin of Recipe:</strong> ${recipeDetails.strArea}</p>
                        <p class="card-text"><strong>Dietary Category:</strong> ${recipeDetails.strCategory}</p>
                        <h5 class="card-subtitle mt-4"><strong>Ingredients:</strong></h5>
                        <ul>
                            ${ingredientsList.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            recipeDetailsContainer.innerHTML = recipeDetailsHTML;
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}

function getIngredientsList(recipe) {
    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredientsList.push(`${measure} of ${ingredient}`);
        }
    }
    return ingredientsList;
}


window.onload = () => {
    fetchCategories();
};
