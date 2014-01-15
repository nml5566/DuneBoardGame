module.exports = testArrakisMap;

var assert = require("assert");
var DuneGame = require("Dune/Game");
var game = DuneGame();
var map = game.getMap();

run();

function run() {
  if (isScriptCalledAsModule()) {
    return;
  } else 
    testArrakisMap();
}

function isScriptCalledAsModule() {
  /* boolean function */
  if (module.parent) {
    return 1;
  } else {
    return 0
  }
}

function testArrakisMap() {
  var ArrakisMap = require("Dune/Map");

  assert.ok(map instanceof ArrakisMap);

  testPolarSink();
  
}

function testPolarSink() {
  var polarSink = map.getLocation("PolarSink");
  assert.ok(polarSink.getNeighbors() == 8);

  testLocationOccupation(polarSink);
}


function testLocationOccupation(mapLocation) {
  var atreides = game.newFaction('Atreides');
  var troops = atreides.getTroops(8);
  assert(troops.length == 8, "Got 8 Atreides troops");
  assert(mapLocation.getFactionCount() == 0);

  mapLocation.occupy(troops);
  assert(mapLocation.getFactionCount() == 1);
  
  var factions = mapLocation.getFactions();
  assert(factions.length == 1);
  assert(factions[0].length == 8);

  testGetLocationCanPassByRef(mapLocation);
}

function testGetLocationCanPassByRef(mapLocation) {
  var locationName = mapLocation.constructor.name;
  var locationRef = map.getLocation(locationName);
  assert(mapLocation === locationRef,
      'getLocation() returns the same location reference');
}
