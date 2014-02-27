var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

}

