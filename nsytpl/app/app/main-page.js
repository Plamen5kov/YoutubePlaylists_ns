var coreView = require("ui/core/view");
var http = require("http");
var app = require("application");
var webViewModule = require("ui/web-view");
var uilayoutsstack_layout = require("ui/layouts/stack-layout");
var localSettings = require("local-settings");
var frameModule = require('ui/frame');

var webView;

function onPageLoaded(args){
	var page = args.object;
	createWebView();
	page.content = webView;;
};

function createWebView() {
	//got from google developer console
	var client_id = '17768073744-g4eihoob0hqb7linved768cuco6ihho1.apps.googleusercontent.com';
	var redirect_url = "http%3A%2F%2Flocalhost";
	var scope = "https://www.googleapis.com/auth/youtube";
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

	    var topmost = frameModule.topmost();
	    topmost.navigate('app/playlists');

	}, function (e) {
	    console.log('<<< ERROR WITH REQUEST FOR ACCESS CODE >>>> ' + e);
	});
};

exports.onPageLoaded = onPageLoaded;