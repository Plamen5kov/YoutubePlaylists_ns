var coreView = require("ui/core/view");
var http = require("http");
var fs = require("file-system");
var app = require("application");
var webViewModule = require("ui/web-view");
var uilayoutsstack_layout = require("ui/layouts/stack-layout");
var localSettings = require("local-settings");
var frameModule = require('ui/frame');

var webView;

function onPageLoaded(args){
	var page = args.object;

	if(!canGetAccessTokenFromFile()){
		console.log('---- creating a web view');
		createWebView();
		page.content = webView;;
	}
	else {
		console.log('----------------------- navigating to playlists page')
		var topmost = frameModule.topmost();
	    topmost.navigate('app/playlists');
	}
};

function canGetAccessTokenFromFile() {
	var documents = fs.knownFolders.documents();
	var path = fs.path.join(documents.path, "access_token.txt");
	var exists = fs.File.exists(path);

	console.log('--------- FILE EXISTS: ' + exists);

	return exists;
}

function createWebView() {
	//got from google developer console
	var client_id = '17768073744-g4eihoob0hqb7linved768cuco6ihho1.apps.googleusercontent.com';
	var redirect_url = "http%3A%2F%2Flocalhost";
	var scope = "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload";
	var url = "https://accounts.google.com/o/oauth2/auth?client_id="+ client_id +"&redirect_uri=" + redirect_url + "&scope=" + scope + "&response_type=code&access_type=offline";

	webView = new webViewModule.WebView();
	webView.addEventListener('loadStarted', loadStartedHandler);
	webView.url = url;
};

function loadStartedHandler(eventData) {
	var strSplit = eventData.url.split('code=');
	var code = strSplit[1];
	if(code){
		postRequestForAccessToken(code);
		webView.removeEventListener('loadStarted');
	}
};

function postRequestForAccessToken(code){

	var domain = "https://accounts.google.com";
	var parameters = "/o/oauth2/token?";
	var client_id = "17768073744-g4eihoob0hqb7linved768cuco6ihho1.apps.googleusercontent.com";
	var redirect_url = "http%3A%2F%2Flocalhost";
	var grant_type = "authorization_code";

	var requestBody = "code=" + code + "&client_id=" + client_id + "&redirect_uri=" + redirect_url + "&grant_type=" + grant_type;
	var finalUrl = domain + parameters;

	var requestOptions = {
		url: finalUrl,
		method: 'POST',
		content: requestBody
	};
	console.log('about to do request');

	http.request(requestOptions).then(function (response) {

	    var resultJson = JSON.parse(response.content);

    	localSettings.setString("access_token", resultJson.access_token);	
    	localSettings.setString("refresh_token", resultJson.access_token);

    	saveAccessTokenToFile(resultJson.access_token);

	    var topmost = frameModule.topmost();
	    topmost.navigate('app/playlists');

	}, function (e) {
	    console.log('<<< ERROR WITH REQUEST FOR ACCESS CODE >>>> ' + e);
	});
};

function saveAccessTokenToFile(token) {

	var documents = fs.knownFolders.documents();
	var path = fs.path.join(documents.path, "access_token.txt");
	var file = fs.File.fromPath(path);

	// Writing text to the file.
	file.writeText(token).then(function () {
	    console.log('>> succeeded writing access token to a file');
	}, function (error) {
	    console.log('>> failed writing access token to a file');
	});
}

exports.onPageLoaded = onPageLoaded;