// example

var recipeInput = $('#recipe-input');
var submitButton = $('#submit-button');

var recipeButtons = [];

function displayRecipes(event){
    event.preventDefault();

    var recipe = recipeInput.val().trim();

    // alert(recipe)

    recipeInput.val("");

    var youtubeURL = `https://www.youtube.com/watch?v=`;

    var queryURL = `https://youtube.googleapis.com/youtube/v3/search?maxResults=5&order=rating&type=video&part=snippet&q=${recipe}%20recipe&key=AIzaSyBVF6OOXp2zdvfP7odqX3iZNqdAEqBOp5Y`

    fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
    //   $("#youtube-display").text(JSON.stringify(data));
    console.log(data)

    var videoArray = data.items

    console.log(videoArray);

    for (let i=0; i<videoArray.length; i++){
        console.log(youtubeURL + videoArray[i].id.videoId)

        // var ytDisplay = $("#youtube-display")

        // console.log(videoArray.snippet.title + videoArray.snippet.thumbnail.default)
    }
    // $("#youtube-display").text()
    // alert(youtubeURL + data.items[0].id.videoId)
    
    });
}


submitButton.on("click", displayRecipes)