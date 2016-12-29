// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get an artists top tracks
var SPOTIFY_ARTIST_TOP_TRACKS_URL = "https://api.spotify.com/v1/artists/spotifyId/top-tracks";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features";

function getSearchDataFromApi(searchTerm, callback){
	var settings = {
		url:  SPOTIFY_SEARCH_URL,
		data: {
			q: searchTerm,
			type: "artist",
		},
		dataType: "json",
		type: "GET",
		success: callback
	};
	$.ajax(settings);
}

function getArtistTopTracksFromApi(spotifyId, callback){
	var settings = {
		url: "https://api.spotify.com/v1/artists/" + spotifyId + "/top-tracks",
		data: {
			id: spotifyId,
			country: "US"
		},
		dataType: "json",
		type: "GET",
		success: callback
	}
	$.ajax(settings);
}

function storeSpotifyId(data){
	var dataArray = data.artists;
	var firstArtistResult = dataArray.items[0];
	var spotifyId = firstArtistResult.id;
	console.log("this is the spotify id: " + spotifyId);

	getArtistTopTracksFromApi(spotifyId, displaySpotifyTopTracksData);
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

function displaySpotifyTopTracksData(tracks){
	var trackArray = tracks.tracks;
	console.log(trackArray);

	var resultElement = "";


	if(trackArray){
		trackArray.forEach(function(element){
			var songName = element.name;

			resultElement += "<p>" + songName + "</p>"
		});
	}
	$(".jsTracksSearchResults").html(resultElement);
}

//Event Listener
function watchSubmit(){
	$(".jsSearchArtistForm").submit(function(event){
		event.preventDefault();
		var query = $(this).find(".jsQuery").val();
		getSearchDataFromApi(query, displaySpotifySearchArtistData);
		getSearchDataFromApi(query, storeSpotifyId);

	});
}

$(function(){
	watchSubmit();
});