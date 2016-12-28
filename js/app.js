// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get an artists top tracks
var SPOTIFY_ARTIST_TOP_TRACKS_URL = "https://api.spotify.com/v1/artists/{id}/top-tracks";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features";

function getSearchDataFromApi(searchTerm, callback){
	var query = {
		q: searchTerm,
		type: "artist"
	}
	$.getJSON(SPOTIFY_SEARCH_URL, query, callback);
}

// //Render Functionality
function displaySpotifySearchArtistData(data){
	var dataArray = data.artists;
	var resultElement = "";

	console.log(dataArray);

	if(dataArray){
		var firstResultObject = dataArray.items[0];
		console.log(firstResultObject);
		var artistName = firstResultObject.name;
		console.log(name);
		var spotifyId = firstResultObject.id;

		resultElement += "<p>" + artistName + spotifyId + "</p>";
	}
	
	else{
		resultElement += "<p>No Results";
	}

	$(".jsSearchResults").html(resultElement);
}

//Event Listener
function watchSubmit(){
	$(".jsSearchArtistForm").submit(function(event){
		event.preventDefault();
		var query = $(this).find(".jsQuery").val();
		getSearchDataFromApi(query, displaySpotifySearchArtistData);
	});
}

$(function(){
	watchSubmit();
});