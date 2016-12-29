// Search for Spotify ID based on query string
// curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"
var SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

// Get Audio Features for multiple Tracks - Requires Spotify ID
var SPOTIFY_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features";

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

// function authorize(){
// 	var settings = {
// 		url: SPOTIFY_AUTHORIZATION_URL,
// 		data: {
// 			client_id: ,
// 			response_type: "token",
// 			redirect_uri: "http://localhost:8888/callback",
// 		}
// 	}
// }

// function getAudioFeaturesFromApi(ids, authorization){
// 	authorize();

// 	$.ajax({
// 		url: 'https://api.spotify.com/v1/me',
// 		headers: {
// 			'Authorization': 'Bearer ' + accessToken
// 	},
// 	   success: function(response){
// 			var settings = {
// 				url: SPOTIFY_AUDIO_FEATURES_URL,
// 				data: {
// 					authorization: ""
// 				}
// 			}
// 	   }
// 	});
// }

// Render Functionality
function displaySpotifySearchArtistData(data){
	var dataArray = data.artists;
	var firstArtistResult = dataArray.items[0];
	var resultElement = "";

	console.log(dataArray);

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
				case (popularity >= "60"):
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

			console.log(popularity);

			trackIdArray.push(trackId);
			popularityArray.push(popularity);

			resultElement += "<p>" + songName + " " +"<img src=" + "img/" + (popularityImage) + ">" + "</p>"
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