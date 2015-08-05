var http = require('http');
var frameModule = require('ui/frame');
var viewModule = require("ui/core/view");
var gesturesModule = require("ui/gestures");
var localSettingsModule = require('application-settings');
var songsViewModule = require('./view-models/songs-view-model');

var listViewModel;

function onPageLoaded(args){

	console.log('------> TRYING TO LOAD PLAYLISTS!!!');

	var page = args.object;
	//get song id
	var clicked_playlist_id = localSettingsModule.getString('clicked_playlist_id');
	listViewModel = songsViewModule.songsViewModel;
	page.bindingContext = listViewModel;

	// songsListView.observe(gesturesModule.GestureTypes.LongPress, function (args) {});

	makeRequestForSongs(clicked_playlist_id);
}

function makeRequestForSongs(playlistId){
	var api_key =  localSettingsModule.getString('api_key');//'AIzaSyA6J5VCyFQYXcny_U0uWpZTq1oJRavQ_kM';

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
		    var counter = 0;
		  	for(var item in items) {

				var songItemInfo = {
					title: items[item].snippet.title,
					// id: items[item].id
					id: counter
				}
				listViewModel.addItem(songItemInfo);
				counter++;
		  	}

		}, function (e) {
			console.log('<<< ERROR WITH REQUEST FOR PLAYLISTS >>>> ' + e);
		}
	);
}

function onMoveUp(args) {
	var stackLayout = args.object.parent.parent;
	viewModule.eachDescendant(stackLayout, moveItemUp);
}

function onMoveDown(args) {
	var stackLayout = args.object.parent.parent;
	viewModule.eachDescendant(stackLayout, moveItemDown);
}

function moveItemUp(currentView) {
	var index = currentView.text;
	if(typeof(index) == 'number') {
		listViewModel.moveItem(index, 'up');	
	}
}

function moveItemDown(currentView) {
	var index = currentView.text;
	if(typeof(index) == 'number') {
		listViewModel.moveItem(index, 'down');	
	}
}

exports.onMoveDown = onMoveDown;
exports.onMoveUp = onMoveUp;
exports.onPageLoaded = onPageLoaded;