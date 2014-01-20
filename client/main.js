var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.debugSetFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  //drawPlayerSeats();
}

/*var canvasController = new CanvasController();*/


//function convertSectorNumberToMapAngle(sectorNumber) {
  //var degreesPerSector = 20;
  
  //[> Dividing by 2 puts the angle in the center of the sector <]
  //var degrees = (sectorNumber * degreesPerSector) + degreesPerSector/2; 
  //var radians = degrees * (Math.PI/180);
  //return radians;
//}

