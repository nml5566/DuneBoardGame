var gameController = require("Dune/Controller");

window.onload = function() {
  

  //var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  drawSquaresOfTerritory();
}

function drawSquaresOfTerritory() 
{
/*  var canvasContainer = require("Dune/CanvasContainer");*/
  //var canvas = canvasContainer.layer("notification");
  /*var ctx = canvas.getContext("2d");*/
  var territoryView = require("Dune/View/Territory");

  //var territoryImage = territoryView.enlargeTerritory('carthag');
  //console.log(territoryImage);
  return;

  // polar sink
  //var coords=[374,484,368,476,361,466,350,466,341,462,332,454,327,454,321,446,324,425,333,408,348,397,366,395,379,391,384,387,391,387,397,394,409,394,413,392,425,392,436,405,434,425,424,439,418,452,411,461,410,473,395,484];

  //false wall east
  //var coords=[455,460,436,469,418,453,425,439,435,425,437,405,426,391,414,391,414,384,427,372,433,360,449,371,467,396,467,426,465,429,465,437];
  
  //rim wall west
  var coords=[484,269,483,267,485,264,484,253,522,187,527,187,532,182,536,183,536,197,530,204,527,219,516,237,516,243,510,243,510,248,500,254,500,259,487,268];

  var s = 8.5;

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

  ctx.strokeRect(smallestX, smallestY,
      width, height);


  var squarePoints = [];
  var x = smallestX;
  var y = smallestY;
  while (x < largestX && y < largestY) {

    squarePoints.push({x: x, y: y});

    x += s;

    if (x > largestX) {
      x = smallestX;
      y += s;
    }

  }


  drawTerritoryOutline(coords, ctx);

  var territorySquares = [];
  for (var i = 0; i < squarePoints.length; i++) {
    var coords = squarePoints[i];

    var topLeft = {"x": coords.x, "y": coords.y};
    var topRight = {"x": coords.x + s, "y": coords.y};

    var bottomLeft = {"x": coords.x, "y": coords.y + s};
    var bottomRight = {"x": coords.x + s, "y": coords.y + s};

    if (
      ctx.isPointInPath(topLeft.x, topLeft.y) 
      && ctx.isPointInPath(topRight.x, topRight.y)
      && ctx.isPointInPath(bottomLeft.x, bottomLeft.y) 
      && ctx.isPointInPath(bottomRight.x, bottomRight.y)
    ) {
      territorySquares.push(topLeft);

      ctx.strokeStyle = "red";
      ctx.strokeRect(topLeft.x, topLeft.y,
	s, s);
    }

  }

  console.log('territorySquares');
  console.log(territorySquares.length);
}

function drawTerritoryOutline(coords, ctx) {

  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 ) {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

}

