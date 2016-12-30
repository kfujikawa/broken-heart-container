// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features?ids=";

var SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize"

var valence = [];

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

	if(trackArray){
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

			// console.log("This is the popularity: " + popularity);

			trackIdArray.push(trackId);
			popularityArray.push(popularity);

			resultElement += "<p class=" + "jsSongResults" + ">" + songName + " " +"<img src=" + "img/" + (popularityImage) + ">" +  "</p>"
		});

	}

	function getAudioFeaturesFromApi(trackIdArray){
		var token = "BQCIYVlQP3oCyXR92F2w02srdzSaIlq54dfMDgkkhlthsZy8sPBjTUWlOa3vGLZV_v7Mp97_DVcwusOeo9nPnq4A1qRQV6bwzqnUp2v7R9A5sB6SGpMI84gQ5uERbfTBxIghh-Be7ts"

		$.ajax({
			url: SPOTIFY_AUDIO_FEATURES_URL + trackIdArray,
			success: function(data, status){
				for(var i = 0; i < data.audio_features.length; i++){
					valence.push(Math.floor(data.audio_features[i].valence * 100));
					console.log(valence);
				}
			}, 

			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + token);
			}
		});
	}

	function displayValenceHearts(valence){
		if(valence){
			valence.forEach(function(element){

				switch (true){
					case (valence >= 90 && valence <= 100):
						valenceImage = "heart_container_90_100.png";
						console.log("valence is 90-100");
						break;
					case (valence >= 75 && valence <= 89):
						valenceImage = "heart_container_75_89.png";
						console.log("valence is 75-89");
						break;
					case (valence >= 60 && valence <= 74):
						valenceImage = "heart_container_60_74.png";
						console.log("valence is 60-74");
						break;
					case (valence >= 45 && valence <= 59):
						valenceImage = "heart_container_45_59.png";
						console.log("valence is 45-59");
						break;
					case (valence >= 30 && valence <= 44):
						valenceImage = "heart_container_30_44.png";
						console.log("valence is 30-44");
						break;
					case (valence >= 15 && valence <= 29):
						valenceImage = "heart_container_15_29.png";
						console.log("valence is 15-29");
						break;
					case (valence >= 0 && valence <= 14):
						valenceImage = "heart_container_0_14.png";
						console.log("valence is 0-14");
						break;
				}

				// resultElement += "<img src=" + "img/" + (valenceImage) + ">"
			});

		}
	}

	$(".jsTracksSearchResults").html(resultElement);

	// $(".jsSongResults").html(resultElement);
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