var http = require('http');
var localSettingsModule = require('local-settings');
var songsViewModule = require('./view-models/songs-view-model');

var listViewModel;

function onPageLoaded(args){
	var page = args.object;
	//get song id
	var clicked_playlist_id = localSettingsModule.getString('clicked_playlist_id');
	listViewModel = songsViewModule.songsViewModel;

	page.bindingContext = listViewModel;

	makeRequestForSongs(clicked_playlist_id);	
}

function makeRequestForSongs(playlistId){
	var api_key = 'AIzaSyA6J5VCyFQYXcny_U0uWpZTq1oJRavQ_kM';

	var requestUrl = 'https://content.googleapis.com/youtube/v3/playlistItems?part=snippet' + '&playlistId=' + playlistId + '&key=' + api_key
	var requestOptions = {
		url: requestUrl,
		method: 'GET'
	};

	http.request(requestOptions)
		.then(function (response) {
			/*response content is the json with the results from query*/
		    var resultJson = JSON.parse(response.content);
		    var jsonString = JSON.stringify(response.content);

		    var items = resultJson.items
		  	for(var item in items) {

				var songItemInfo = {
					title: items[item].snippet.title,
					id: items[item].id
				}
				console.log('------> ' + songItemInfo.title);
				console.log('------> ' + songItemInfo.id);
				listViewModel.addItem(songItemInfo);
		  	}

		}, function (e) {
			console.log('<<< ERROR WITH REQUEST FOR PLAYLISTS >>>> ' + e);
		}
	);
}

exports.onPageLoaded = onPageLoaded;