// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get an artists top tracks
var SPOTIFY_ARTIST_TOP_TRACKS_URL = "https://api.spotify.com/v1/artists/{id}/top-tracks";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features";


// Get Spotify Data
function getSearchDataFromApi(searchTerm, callback){
	var query = {
		q: searchTerm,
		type: "artist"
	}
	$.getJSON(SPOTIFY_SEARCH_URL, query, callback);

}
	function getArtistTopTracksFromApi(spotifyId, callback){
		var query = {
			id: spotifyId,
			country: "US"
		}
		$.getJSON(SPOTIFY_ARTIST_TOP_TRACKS_URL, query, callback);
	}


// Render Functionality
function displaySpotifySearchArtistData(data){
	var dataArray = data.artists;
	var firstArtistResult = dataArray.items[0];
	var resultElement = "";

	console.log(dataArray);

	if(firstArtistResult){
		var artistName = firstArtistResult.name;
		var spotifyId = firstArtistResult.id;

		resultElement += "<h3>" + "Artist: " + artistName + "</h3>" +
						"<p>" + spotifyId + "</p>";
	}
	
	else{
		resultElement += "<p>No Results.  Please modify your search and try again";
	}

	$(".jsArtistSearchResults").html(resultElement);
}

// function displaySpotifyTopTracksData(tracks){
// 	var trackArray = tracks.name;
// 	console.log(trackArray);

// 	$(".jsTracksSearchResults").html(resultElement);
// }

//Event Listener
function watchSubmit(){
	$(".jsSearchArtistForm").submit(function(event){
		event.preventDefault();
		var query = $(this).find(".jsQuery").val();
		getSearchDataFromApi(query, displaySpotifySearchArtistData);
		// getSearchDataFromApi(query, displaySpotifyTopTracksData);
	});
}

$(function(){
	watchSubmit();
});