var application = require('application');

application.mainModule = 'app/main-page';
application.onUncaughtError = function (error) {
    console.log("Application error: " + error.name + "; " + error.message + "; " + error.nativeError);
};

application.start();
