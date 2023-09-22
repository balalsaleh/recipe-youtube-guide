 // YouTube API key
 const youtubeApiKey = "AIzaSyB5dX3pFkRAZUPgX1JfHuPeSJdUvmd7KhU";
 // Edamam API 
 const edamamAppId = "1cea0e34";
 const edamamAppKey = "b721fff2c6fa8f9d45ed5fbbf3ca804d";

 // Function to search YouTube videos
 function searchYouTube(query, recipe) {
     const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&type=video&q=${query}`;

     $.get(youtubeUrl, function(data) {
         const videos = data.items;
         if (videos.length > 0) {
             const video = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videos[0].id.videoId}" frameborder="0" allowfullscreen></iframe>`;
             displayRecipeAndVideo(recipe, video);
         } else {
             displayNoResults();
         }
     });
 }

 // Function to search for recipes using Edamam API
 function searchRecipes(query) {
     const ingrRange = '5-10'; // Specify the number of ingredients
     const edamamUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${edamamAppId}&app_key=${edamamAppKey}&q=${query}&ingr=${ingrRange}`;

     $.get(edamamUrl, function(data) {
         const recipes = data.hits;
         if (recipes.length > 0) {
             const recipe = recipes[0].recipe;
             // Search for a related YouTube video using the recipe title
             searchYouTube(recipe.label, recipe);
         } else {
             displayNoResults();
         }
     });
 }

 // Function to display both recipe and video side by side
 function displayRecipeAndVideo(recipe, video) {
     const searchResults = document.getElementById("searchResults");
     searchResults.innerHTML = "";

     const recipeLabel = recipe.label;
     const recipeImage = recipe.image;
     const ingredients = recipe.ingredientLines;

     // Create a container for both recipe and video
     const containerDiv = document.createElement("div");
     containerDiv.className = "col-md-12 recipe-video-container";

     // Create a div for the recipe with the "recipe" class
     const recipeDiv = document.createElement("div");
     recipeDiv.className = "col-md-6 recipe";
     recipeDiv.innerHTML = `<h4>${recipeLabel}</h4><img src="${recipeImage}" alt="${recipeLabel}" />`;

     // Create a list for ingredients
     const ingredientsList = document.createElement("ul");
     ingredients.forEach(ingredient => {
         const ingredientItem = document.createElement("li");
         ingredientItem.textContent = ingredient;
         ingredientsList.appendChild(ingredientItem);
     });

     recipeDiv.appendChild(ingredientsList);
     containerDiv.appendChild(recipeDiv);

     // Create a div for the video with the "video" class
     const videoDiv = document.createElement("div");
     videoDiv.className = "col-md-6 video";
     videoDiv.innerHTML = video;

     containerDiv.appendChild(videoDiv);
     searchResults.appendChild(containerDiv);
 }

 // Function to display a message when no results are found
 function displayNoResults() {
     const searchResults = document.getElementById("searchResults");
     searchResults.innerHTML = "<p>No results found.</p>";
 }

 // Function to handle search input on Enter key press
 document.getElementById("searchInput").addEventListener("keydown", function(event) {
     if (event.key === "Enter") {
         const query = document.getElementById("searchInput").value;
         searchRecipes(query);
     }
 });

 // Function to handle search button click
 document.getElementById("searchButton").addEventListener("click", function() {
     const query = document.getElementById("searchInput").value;
     searchRecipes(query);
 });
 

 // ... (previous JavaScript code) ...

// Array to store saved search queries
const savedQueries = [];

// Function to update saved search queries buttons
function updateSavedSearches(query) {
    savedQueries.push(query);
    const savedSearchesContainer = document.getElementById("savedSearches");
    savedSearchesContainer.innerHTML = "";

    // Create buttons for each saved query
    savedQueries.forEach((savedQuery, index) => {
        const queryButton = document.createElement("button");
        queryButton.className = "btn btn-secondary saved-query-button"; // btn-primary = blue btn-secondary = grey
        queryButton.textContent = savedQuery;
        queryButton.style.marginRight = "5px"; // Add margin to the right of each button
        queryButton.addEventListener("click", () => {
            // When a saved query button is clicked, perform the search
            document.getElementById("searchInput").value = savedQuery;
            searchRecipes(savedQuery);
        });
        savedSearchesContainer.appendChild(queryButton);
    });
}

// Function to handle search input on Enter key press
document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const query = document.getElementById("searchInput").value;
        searchRecipes(query);
        updateSavedSearches(query);
    }
});

// Function to handle search button click
document.getElementById("searchButton").addEventListener("click", function() {
    const query = document.getElementById("searchInput").value;
    searchRecipes(query);
    updateSavedSearches(query);
});
