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

  testTerritories();
}

function testTerritories() {
  testPolarSink();
  testCielagoNorth();  
  testArsunt();
  testHaggaBasin();
  testCarthag();
  testImperialBasin();
  testTsimpo();
  testPlasticBasin();
  testFalseWallEast();
  testShieldWall();
  testHargPass();
  testTheMinorErg();
  testWindPass();
  testCielagoDepression();
  testFalseWallSouth();
  testCielagoEast();
}

function testPolarSink() {
  testTerritory({"module": "PolarSink", "neighbors": 8});
}

function testCielagoNorth() {
  testTerritory({"module": "CielagoNorth", "neighbors": 7});
}

function testArsunt() {
  testTerritory({"module": "Arsunt", "neighbors": 4});
}

function testHaggaBasin() {
  testTerritory({"module": "HaggaBasin", "neighbors": 6});
}

function testCarthag() {
  testTerritory({"module": "Carthag", "neighbors": 4});
}

function testImperialBasin() {
  testTerritory({"module": "ImperialBasin", "neighbors": 10});
}

function testTsimpo() {
  testTerritory({"module": "Tsimpo", "neighbors": 6});
}

function testPlasticBasin() {
  testTerritory({"module": "PlasticBasin", "neighbors": 9});
}

function testFalseWallEast() {
  testTerritory({"module": "FalseWallEast", "neighbors": 5});
}

function testShieldWall() {
  testTerritory({"module": "ShieldWall", "neighbors": 7});
}

function testHargPass() {
  testTerritory({"module": "HargPass", "neighbors": 5});
}

function testTheMinorErg() {
  testTerritory({"module": "TheMinorErg", "neighbors": 5});
}

function testWindPass() {
  testTerritory({"module": "WindPass", "neighbors": 8});
}

function testCielagoDepression() {
  testTerritory({"module": "CielagoDepression", "neighbors": 5});
}

function testFalseWallSouth() {
  testTerritory({"module": "FalseWallSouth", "neighbors": 5});
}

function testCielagoEast() {
  testTerritory({"module": "CielagoEast", "neighbors": 5});
}


function testTerritory(obj) {
  var territory = map.getTerritory(obj.module);

  testTerritoryCache(territory);
  testTerritoryNeighbors(territory, obj.neighbors);
  testTerritoryOccupation(territory);
}

function testTerritoryNeighbors(territory, neighborCount) {

  assert.ok(territory.getNeighbors().length == neighborCount,
    territory.constructor.name + " has " + neighborCount + " neighbors");
}


function testTerritoryOccupation(territory) {
  var atreides = game.newFaction('Atreides');
  var troops = atreides.getTroops(8);

  /* Territory should start empty */
  assert(territory.getFactions().length == 0);

  territory.occupyWith(troops);
  assert(territory.getFactions().length == 1);
  
  var factions = territory.getFactions();
  assert(factions.length == 1);
  assert(factions[0].length == 8);

}

function testTerritoryCache(territory) {
  /* Make sure we're passing territories around by reference so they'll
   * remember their game state */
  testTerritoryCacheByDirectRequest(territory);
  testTerritoryCacheByNeighborRequest(territory);
}

function testTerritoryCacheByDirectRequest(territory) {
  var territoryName = territory.constructor.name;
  var territoryRef = map.getTerritory(territoryName);

  assert(territory === territoryRef,
      'getTerritory() returns the same territory reference');
}

function testTerritoryCacheByNeighborRequest(territory) {
  /* TODO flesh out all territory objects before running this */
  var neighbors = territory.getNeighbors();
  var randomSlot = Math.floor((Math.random()*neighbors.length)+0)

  var neighbor1 = territory.getNeighbors()[randomSlot];
  var neighbor2 = neighbor1.getNeighbor(territory.constructor.name);

  assert.ok(neighbor2 === territory,
      "Territory can pass by reference via getNeighbors()");

}
