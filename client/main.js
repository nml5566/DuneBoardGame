var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  //test();
}

var canvasContainer = require("Dune/CanvasContainer");
var canvas = canvasContainer.layer("notification");
var ctx = canvas.getContext("2d");

var eventChain = require("Dune/EventChain");
var spiceDeckView = require("Dune/View/Deck/Spice");
var mapView = require("Dune/View/Map");

function test() 
{

  var spiceBlowTerritories = [
    /*["cielagoSouth", 12],*/
    //["cielagoNorth", 8],
    //["windPassNorth", 6],
    //["theMinorErg", 8],
    //["haggaBasin", 6],
    //["brokenLand", 8],
    //["oldGap", 6],
    //["sihayaRidge", 6],
    //["redChasm", 8],
    //["southMesa", 10],
    //["rockOutcroppings", 6],
    //["funeralPlain", 6],
    //["theGreatFlat", 10],
    /*["habbanyaErg", 8],*/
    ["habbanyaRidgeFlat", 10]
  ];

  for (var i = 0; i < spiceBlowTerritories.length; i++) 
  {
    //var territoryName = "cielagoNorth";
    var territoryName = spiceBlowTerritories[i][0];
    var spiceCount = spiceBlowTerritories[i][1];

    var territoryView = mapView.getTerritory(territoryName);

    var card = {territory: territoryName, spice: spiceCount};

    makeSpiceBlowEvent(card, territoryView);
  }
  eventChain.next();
}

function makeSpiceBlowEvent(card, territoryView) 
{
  eventChain.add(function () { spiceDeckView.dealCard(card) });
  eventChain.add(function () { territoryView.animateSpiceBlow(card) });
}
