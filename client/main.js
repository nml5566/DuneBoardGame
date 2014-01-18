var GameController = require("Dune/Controller");

window.onload = function() {
 new GameController();

 //var t = require("Dune/Factions/Atreides");
 var DuneGame = require("Dune/Game");
 var game = new DuneGame();
 var faction = game.newFaction('Atreides');
 console.log(faction);
 
 /* DEBUG MODE */
 //var mapView = new MapView(["Atreides","Harkonnen"]);
 //mapView.show();
}



