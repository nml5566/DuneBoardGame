var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  drawTroopShipments();
}

function drawTroopShipments() 
{
  console.log('draw troop shipments test');
  var areas = document.getElementsByTagName("area");
  console.log(areas);
  var coords;
  for (var i = 0; i < areas.length; i++) 
  {
    var area = areas[i];
    if (area.target == "rimWallWest") 
    {
      coords = area.coords.split(",").map(function(c) { return parseInt(c, 10); });
      break;
    }
  }
  console.log('coords');
  console.log(coords);
  drawTerritoryOutline(coords, "white", 5);
  drawTerritoryOutline(coords, "black");

/*  var scale = 0.05;*/
  //scale = 0.1;
  //var redCoords = scaleCoords(coords, scale * 1);
  //drawTerritoryOutline(redCoords, "red");
  
  //var blueCoords = scaleCoords(coords, scale * 2);
  //drawTerritoryOutline(blueCoords, "blue");

  //var greenCoords = scaleCoords(coords, scale * 3);
  //drawTerritoryOutline(greenCoords, "green");

  //var orangeCoords = scaleCoords(coords, scale * 4);
  //drawTerritoryOutline(orangeCoords, "orange");

  //var blackCoords = scaleCoords(coords, scale * 5);
  /*drawTerritoryOutline(blackCoords, "black");*/

}

function drawTerritoryOutline(coords, strokeStyle, lineWidth) {

  if (! lineWidth) lineWidth = 3;

  var canvasContainer = require("Dune/CanvasContainer");
  var canvas = canvasContainer.layer("troopscreen");
  var ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 ) {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();

}

function scaleCoords(coords, percent) {

  var scaleCoords = [];

  var rectangle = getTerritoryMinimumBoundingRectangle(coords);

  var newWidth = rectangle.width - (percent * rectangle.width);
  var newHeight = rectangle.height - (percent * rectangle.height);

  var newSize = {
    "xPos": rectangle.x + (rectangle.width - newWidth)/2,
    "yPos": rectangle.y + (rectangle.height - newHeight)/2,
    "width": newWidth,
    "height": newHeight
  }
  console.log(rectangle);
  console.log(newSize);

  var xShift = coords[0] - newSize.xPos; 
  var yShift = coords[1] - newSize.yPos;

  var scaleX = newSize.width / rectangle.width;
  var scaleY = newSize.height/ rectangle.height;
  var scale = Math.max(scaleX, scaleY);

  for( i=0 ; i < coords.length-1 ; i+=2 )
  {
    var xShift = (rectangle.x * scale - newSize.xPos);
    var yShift = (rectangle.y * scale - newSize.yPos);

    scaleCoords[i] = coords[i] * scale;
    scaleCoords[i+1] = coords[i+1] * scale;

    scaleCoords[i] -= xShift;
    scaleCoords[i+1] -= yShift;
  }

  return scaleCoords;
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

