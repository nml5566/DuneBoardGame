// Node server for the Dune board game

var express = require("express");
var app = express();

setViews();
registerJadeFileExtensionHook();
setStaticFileServerDirectory();
setUrlPathRedirect();
listenForIncomingRequests();


function setViews() {
  setViewsDirectory();
  setViewsEngine();
}

function setViewsDirectory() {
  app.set("views",__dirname + "/views");
}

function setViewsEngine() {
// *.html files in views directory will open with jade template system
  app.set("view engine","jade");
}

function registerJadeFileExtensionHook() {
// Register *.jade files to open using the jade template system
  app.engine("jade", require("jade").__express);
}

function setStaticFileServerDirectory() {
// for css, js, images
  app.use(express.static(__dirname + "/public"));
}

function setUrlPathRedirect() {
  app.get("/", function(req, res) {
    res.render("index");
  });
}

function listenForIncomingRequests() {
  var port = 3000;
  app.listen(port);
  console.log("Running Dune Board Game server");
  console.log("Listening on port " + port);
}
