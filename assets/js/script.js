var recipeInput = $('#recipe-input');
var submitButton = $('#submit-button');
var youtubeDisplay = $('#youtube-display');

var recipeButtons = [];

function displayRecipes(event){
    event.preventDefault();

    var recipe = recipeInput.val().trim();
    // alert(recipe)

    recipeInput.val("");
    youtubeDisplay.empty();

    var youtubeURL = `https://www.youtube.com/watch?v=`;

    var queryURL = `https://youtube.googleapis.com/youtube/v3/search?maxResults=5&order=viewCount&videoDefinition=high&type=video&videoDuration=medium&part=snippet&q=${recipe}%20recipe%20how%20to&key=AIzaSyBVF6OOXp2zdvfP7odqX3iZNqdAEqBOp5Y`

    fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
    //   $("#youtube-display").text(JSON.stringify(data));
      console.log(data)

    var videoArray = data.items

    // console.log(videoArray);

    for (let i=0; i<videoArray.length; i++){
        if (videoArray.length > 0) {
        var video = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoArray[i].id.videoId}" frameborder="0" allowfullscreen></iframe>`
        }

        console.log(video)
        displayVideo(video)
    }
    // $("#youtube-display").text()
    // alert(youtubeURL + data.items[0].id.videoId)
  });
}

function displayVideo(video){


  var containerDiv = $("<div>");
  containerDiv.addClass("col-md-12 m-2 px-5 pt-3 recipe-video-container");
  
  $(containerDiv).html(video);

  // containerDiv.append(videoArray);
  youtubeDisplay.append(containerDiv);

}
submitButton.on("click", displayRecipes)