var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  //loadRoundHighlightMarkers();
  //highlightStormRound();
}


var Loader = require("Dune/Loader");
var loader = new Loader();
var canvasContainer = require("Dune/CanvasContainer");
var roundCanvas = canvasContainer.layer('roundscreen');
var roundCtx = roundCanvas.getContext("2d");

var roundMarkers = {
  "storm": {"x": 174}, 
  "spiceblow": {"x": 221}, 
  "bidding": {"x": 269}, 
  "movement": {"x": 457},
  "battle": {"x": 504},
  "collection": {"x": 552}
};

function loadRoundHighlightMarkers() 
{

  for (var m in roundMarkers) {
    var url = "/img/rounds/" + m + ".png";
    roundMarkers[m].img = loader.loadImage(url);
  }


  loader.onload = drawRoundMarkers;
}

function drawRoundMarkers() 
{
  setRoundMarkerDimensions();

  for (var marker in roundMarkers) {
    var props = roundMarkers[marker];
    var img = props.img;

    roundCtx.drawImage(
      img,
      img.xPos, img.yPos,
      img.width, img.height);

  }
}


function setRoundMarkerDimensions() 
{
  var markerScale = 43;
  var yPos = 21;

  for (var marker in roundMarkers) {
    var props = roundMarkers[marker];
    var img = props.img;
    img.xPos = props.x;
    img.yPos = yPos;
    img.width = img.height = markerScale;
  }
}

function highlightStormRound() {

  var roundMarkerUrl = "/img/rounds/storm.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 174;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightSpiceBlowRound() {

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 221;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightBiddingRound() {
  var roundMarkerUrl = "/img/rounds/bidding.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 269;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightMovementRound() {
  var roundMarkerUrl = "/img/rounds/movement.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 317;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}
