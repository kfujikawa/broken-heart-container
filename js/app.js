// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features?ids=";

var SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize"

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
	getArtistTopTracksFromApi(spotifyId, displaySpotifyTopTracksData);
}

// Render Functionality
function displaySpotifySearchArtistData(data){
	var dataArray = data.artists;
	var firstArtistResult = dataArray.items[0];
	var resultElement = "";

	if(firstArtistResult){
		var artistName = firstArtistResult.name;
		var spotifyId = firstArtistResult.id;

		resultElement += "<h3>" + "Artist: " + artistName + "</h3>";
	}
	
	else{
		resultElement += "<p>No Results.  Please modify your search and try again";
	}

	$(".jsArtistSearchResults").html(resultElement);
}

function displaySpotifyTopTracksData(tracks){
	var trackArray = tracks.tracks;
	var resultElement = "";
	var trackIdArray = [];
	var popularityArray = [];
	var valence = [];

	if(trackArray){
		console.log(tracks);
		trackArray.forEach(function(element){
			var songName = element.name;
			var trackId = element.id;
			var popularity = element.popularity;
			var popularityImage = "";

			switch (true){
				case (popularity >= 90 && popularity <= 100):
					popularityImage = "heart_container_90_100.png";
					break;
				case (popularity >= 75 && popularity <= 89):
					popularityImage = "heart_container_75_89.png";
					break;
				case (popularity >= 60 && popularity <= 74):
					popularityImage = "heart_container_60_74.png";
					break;
				case (popularity >= 45 && popularity <= 59):
					popularityImage = "heart_container_45_59.png";
					break;
				case (popularity >= 30 && popularity <= 44):
					popularityImage = "heart_container_30_44.png";
					break;
				case (popularity >= 15 && popularity <= 29):
					popularityImage = "heart_container_15_29.png";
					break;
				case (popularity >= 0 && popularity <= 14):
					popularityImage = "heart_container_0_14.png";
					break;
			}

			console.log("This is the popularity: " + popularity);

			trackIdArray.push(trackId);
			popularityArray.push(popularity);

			resultElement += "<p>" + songName + " " +"<img src=" + "img/" + (popularityImage) + ">" +  "</p>"
		});

	}

	function getAudioFeaturesFromApi(trackIdArray){
		var token = "BQCuiaJQOfKgT99f3nlpoF38jQ3DBPKCl4JfQqMqgDJLmHJPDMrbeOBESNqjGNC2QF9Sr0wR4nb090f8pGY2nty-cL8Bh93yKAT6cMR6UjwYvw_SYdN_D1MvOH855EE2hRmdsRcziBE"

		$.ajax({
			// url: SPOTIFY_AUDIO_FEATURES_URL + trackIdArray,
			url: "https://api.spotify.com/v1/audio-features?ids=4vb4mFvYsr2h6enhjJsq9Y,4BHzQ9C00ceJxfG16AlNWb,4kflIGfjdZJW4ot2ioixTB,4sPmO7WMQUAf45kwMOtONw,7IWkJwX9C0J7tHurTD7ViL,1CkvWZme3pRgbzaxZnTl5X,7rPLZ8Krm6CZIbraFUlnWZ,1wMALZpuqAy7amQsFBWQ8m,3CKCZ9pfwAfoMZlMncA1Nc,7GgQi7JTG4b6J4iEF4RTjF",
			success: function(data, status){
				for(var i = 0; i < data.audio_features.length; i++){
					valence.push(data.audio_features[i].valence);
					console.log(valence);
				}
			}, 

			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + token);
			}
		});
	}
	getAudioFeaturesFromApi(trackIdArray);

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