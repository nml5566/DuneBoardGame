var gameController = require("Dune/Controller");

window.onload = function() {
  

  //var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  testTerritoryClick();
}

function testTerritoryClick()
{
  //var map = document.getElementsByName("map")[0];;
  //console.log(map);

/*  var canvasContainer = require("Dune/CanvasContainer");*/
  //var canvas = canvasContainer.getTopLayer();


  //var ctx = canvas.getContext("2d");

  //var territories = [ 
    //[
      //"Cielago North",
      //[411,473,395,485,373,485,361,467,301,571,303,576,303,579,320,594,361,598,367,593,383,594,418,616,429,608,441,588,450,579,458,554]
    //],
    //[
      //"Polar Sink",
      //[374,484,368,476,361,466,350,466,341,462,332,454,327,454,321,446,324,425,333,408,348,397,366,395,379,391,384,387,390,387,397,394,409,394,413,392,425,392,436,405,434,425,424,439,418,453,411,461,410,473,395,484]
    //]
  //];

 
  //canvas.addEventListener('click', function(e) {
    //var coord = getMousePosition(this,e);

    //for (var i = 0; i < territories.length; i++) 
    //{
      //var territory = territories[i];
      //var name = territory[0];
      //var coords = territory[1];

      //drawTerritoryOutline(coords, ctx);

      //if (ctx.isPointInPath(coord.x, coord.y)) 
	//console.log('clicked ' + name);
    //}

  /*});*/

  
  var areaTags = document.getElementsByTagName("area");
  for (var i = 0; i < areaTags.length; i++) {
    var areaTag = areaTags[i];
    areaTag.addEventListener('click', function(e) {
      console.log(this.target);
    });
  }
  console.log(areaTags);

  var territoryScreen = document.getElementById("territoryscreen");
  territoryScreen.style.display = "block";
  territoryScreen.style.zIndex = 200;
  /*console.log(test);*/
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


