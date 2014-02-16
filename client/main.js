var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  drawTroopShipments();
}

var canvasContainer = require("Dune/CanvasContainer");
var shuffleArray = require("Dune/shuffle");
var canvas = canvasContainer.layer("troopscreen");
var ctx = canvas.getContext("2d");

function drawTroopShipments() 
{
  console.log('draw troop shipments test');
  var areas = document.getElementsByTagName("area");

  for (var i = 0; i < areas.length; i++) 
  {
    var area = areas[i];
    area.addEventListener('click', function(e) 
    {
      if (this.clickCount === undefined) this.clickCount = 0;
      this.clickCount++;

      //drawFactionGradient(this);

      var coords = 
	this.coords.split(",").map(function(c) { return parseInt(c, 10); });
      //drawTerritoryOutline(coords);
      divideTerritory(this);
    });
  }
}

function drawTerritoryOutline(coords)
{

  var rectangle = getTerritoryMinimumBoundingRectangle(coords);
  var grad = ctx.createLinearGradient(rectangle.x, rectangle.y, 
    rectangle.x + rectangle.width, rectangle.y);
  grad.addColorStop(0, 'rgba(0,255,0,0.6)');
  grad.addColorStop(1 / 5, 'white');
  grad.addColorStop(2 / 5, 'rgba(0,0,0,0.6)');
  grad.addColorStop(3 / 5, 'white');
  grad.addColorStop(4 / 5, 'rgba(255,128,0,0.6)');
  //grad.addColorStop(1, 'white');

  drawTerritoryPath(coords);
  ctx.fillStyle = grad;
  ctx.fill();

}

function drawTerritoryPath(coords) 
{

  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 ) {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();
}

function divideTerritory(area) 
{

    var coords = 
      area.coords.split(",").map(function(c) { return parseInt(c, 10); });

    //var testCanvas = canvasContainer.layer("test");
    var testCanvas = document.createElement("canvas");
    testCanvas.width = canvas.width;
    testCanvas.height = canvas.height;
    var testCtx = testCanvas.getContext("2d");

    testCtx.globalCompositeOperation = "destination-atop";
    var rectangle = getTerritoryMinimumBoundingRectangle(coords);

    var alpha = "0.8)";
    var red = "rgba(255,0,0," + alpha;
    var orange = "rgba(255,128,0," + alpha;
    var yellow = "rgba(255,255,0," + alpha;
    var green = "rgba(0,255,0," + alpha;
    var blue = "rgba(0,0,255," + alpha;
    var black = "rgba(0,0,0," + alpha;


    var colors = new Array(red, orange, yellow, green, blue, black);
    var order = {};
    for (var i = 0; i < colors.length; i++) { order[colors[i]] = i }

    shuffleArray(colors);

    var selectColors = colors.slice(0, area.clickCount);
    selectColors.sort(function(a, b) {
      return order[a] - order[b]
    });

    if (area.clickCount > 6) area.clickCount = 6;

    for (var i = 1; i < area.clickCount; i++)
    {
      testCtx.fillStyle = selectColors.shift();
      testCtx.lineWidth = 4;
      testCtx.strokeStyle = "black";
      testCtx.strokeRect(rectangle.x, rectangle.y, 
	rectangle.width * i / area.clickCount, rectangle.height
      );
      testCtx.fillRect(rectangle.x, rectangle.y, 
	rectangle.width * i / area.clickCount, rectangle.height
      );
    }

    testCtx.beginPath();
    testCtx.moveTo(coords[0], coords[1]);
    for( item=2 ; item < coords.length-1 ; item+=2 ) {
      testCtx.lineTo( coords[item] , coords[item+1] )
    }
    testCtx.closePath();
    testCtx.fillStyle = selectColors.shift();
    testCtx.fill();


    ctx.fillStyle = "black";
    drawTerritoryPath(coords);
    ctx.fill();
    
    ctx.globalCompositeOperation = "xor";
    drawTerritoryPath(coords);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(testCanvas, 0, 0);

}

function getTerritoryMinimumBoundingRectangle(coords) {

  var smallestX = undefined,
      largestX = undefined, 
      smallestY = undefined,
      largestY = undefined; 

  for( i=2 ; i < coords.length-1 ; i+=2 )
  {
    var x= coords[i], y = coords[i+1];

    if (smallestX == undefined) { smallestX = x }
    else if (x < smallestX) { smallestX = x }

    if (smallestY == undefined) { smallestY = y }
    else if (y < smallestY) { smallestY = y }

    if (largestX == undefined) { largestX = x }
    else if (x > largestX) { largestX = x }

    if (largestY == undefined) { largestY = y }
    else if (y > largestY) { largestY = y }
  }

  var width = largestX - smallestX;
  var height = largestY - smallestY;

  var rectangle = {"x": smallestX, "y": smallestY, 
    "width": width, "height": height};

  return rectangle;
}

function drawFactionGradient(area) 
{

  var coords = 
	area.coords.split(",").map(function(c) { return parseInt(c, 10); });

  var rectangle = getTerritoryMinimumBoundingRectangle(coords);
  var grad = ctx.createLinearGradient(
    rectangle.x, rectangle.y,
    rectangle.x + rectangle.width, rectangle.y + rectangle.height
  ); 

  var red = "rgba(255,0,0,1)"
  var orange = "rgba(255,128,0,1)"
  var yellow = "rgba(255,255,0,1)"
  var green = "rgba(0,255,0,1)"
  var blue = "rgba(0,0,255,1)"
  var black = "rgba(0,0,0,1)"

  var order = {
    "rgba(255,0,0,1)": 0,
    "rgba(255,128,0,1)": 1,
    "rgba(255,255,0,1)": 2,
    "rgba(0,255,0,1)": 3,
    "rgba(0,0,255,1)": 4,
    "rgba(0,0,0,1)": 5,
  }

  var colors = new Array(red, orange, yellow, green, blue, black);
  shuffleArray(colors);

  var selectColors = colors.slice(0, area.clickCount);
  selectColors.sort(function(a, b) {
    return order[a] - order[b]
  });

  grad.addColorStop(0, colors.shift());

  if (area.clickCount > 6) area.clickCount = 6;

  if (area.clickCount == 1) {
    grad.addColorStop(1, 'white');
  } else {
    for (var i = 1; i < area.clickCount; i++) {
      grad.addColorStop(i / area.clickCount, colors.shift());
    }
  }
  grad.addColorStop(1, 'white');

  drawTerritoryPath(coords);
  ctx.fillStyle = grad;
  ctx.fill();

}

function getColors(number, colors) 
{
  //var colors = new Array("green");
  //shuffleArray(colors);
  var c = colors.slice(0, number);
  return c;
}

function getStrokeStyle(color) 
{
  switch (color) {
    case "blue":
    case "black":
    case "green":
      return "white";
    case "red":
    case "orange":
    case "yellow":
      return "black";
  }
}
