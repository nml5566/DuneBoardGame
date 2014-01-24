var gameController = require("Dune/Controller");

window.onload = function() {
  

  //var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  testTerritoryClick();
}

var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");

function testTerritoryClick()
{

  var loader = new Loader();

  var territoryImages = {
    "carthag": "/img/territories/carthag.png",
    "arrakeen": "/img/territories/arrakeen.png"
  };

  for (territoryName in territoryImages) {
    var territoryUrl = territoryImages[territoryName];
    territoryImages[territoryName] = loader.loadImage(territoryUrl);
  }

  var areaTags = document.getElementsByTagName("area");
  for (var i = 0; i < areaTags.length; i++) {
    var areaTag = areaTags[i];
    areaTag.addEventListener('click', function(e) {
      console.log(this.target);
      console.log(territoryImages[this.target]);
      if (! territoryImages[this.target]) return;
      enlargeTerritory(territoryImages[this.target]);
    });
  }
  console.log(areaTags);

  var territoryScreen = document.getElementById("territoryscreen");
  territoryScreen.style.display = "block";
  territoryScreen.style.zIndex = 200;
}

function enlargeTerritory(territoryImage) {
  console.log('enlarging territory');
  var canvas = canvasContainer.layer('notification');
  var context = canvas.getContext("2d");

  var circle = mapView.circle;

  var imageScaleWidth = circle.radius * 2;
  var imageScaleHeight = circle.radius * 2;

  context.drawImage(territoryImage, 
      circle.centerX - territoryImage.width/2, 
      circle.centerY - territoryImage.height/2);
}

function drawTerritoryOutline(coords, ctx) 
{
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 )
  {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

}

function getMousePosition(canvasElement,e)
{
  var rect = canvasElement.getBoundingClientRect();
  var mousex = e.clientX - rect.left; 
  var mousey = e.clientY - rect.top;

  return {x: mousex, y: mousey};
}


