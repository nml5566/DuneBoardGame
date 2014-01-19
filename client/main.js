var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.debugSetFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();
}



