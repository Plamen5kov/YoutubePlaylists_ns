var http = require('http');
var view = require('ui/core/view');
var labelModule = require('ui/label');
var frameModule = require('ui/frame');
var localSettings = require('local-settings');

var playlistViewModule = require('./view-models/playlists-view-model');

var page;
var playlistViewModel;

function onLoaded(args){
	page = args.object;

	playlistViewModel  = playlistViewModule.listViewModel;
	page.bindingContext = playlistViewModel;

	var webView = view.getViewById(page, 'lv_playlists');
	webView.on('itemTap', requestTapedPlaylist);

	if(playlistViewModel.length == 0) {
		makePlaylistRequest();
	}
}

function requestTapedPlaylist(args) {

	var id = playlistViewModel.getItem(args.index).id;
	localSettings.setString('clicked_playlist_id', id);
	
	var topmost = frameModule.topmost();
	topmost.navigate('app/playlist');
}

function makePlaylistRequest(){
	//got from google developer console
	var api_key = 'AIzaSyA6J5VCyFQYXcny_U0uWpZTq1oJRavQ_kM';//any referer allowed
	var finalUrl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key=' + api_key;

	var requestOptions = {
		url: finalUrl,
		method: 'GET',
		headers: {
			authorization: 'Bearer ' + localSettings.getString('access_token')
		}
	};

	http.request(requestOptions)
		.then(function (response) {
			/*response content is the json with the results from query*/
		    var resultJson = JSON.parse(response.content);

		    var items = resultJson.items
		  	for(var item in items) {

				var playlistInfo = {
					title: items[item].snippet.title,
					id: items[item].id
				}

				playlistViewModel.addItem(playlistInfo);
		  	}

		}, function (e) {
			console.log('<<< ERROR WITH REQUEST FOR PLAYLISTS >>>> ' + e);
		}
	);
}

exports.onLoaded = onLoaded;