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
  testOldGap();
  testFalseWallWest();
  testArrakeen();
  testCielagoSouth();
  testTheGreaterFlat();
  testWindPassNorth();
  testTheGreatFlat();
  testRimWallWest();
  testCielagoWest();
  testBrokenLand();
  testPastyMesa();
  testHoleInTheRock();
  testFuneralPlain();
  testBightOfTheCliff();
  testBasin();
  testSietchTabr();
  testRockOutcropping();
  testTueksSietch();
  testSihayaRidge();
  testMeridian();
  testSouthMesa();
  testGaraKulon();
  testRedChasm();
  testHabbanyaRidgeFlat();
  testHabbanyaErg();
  testHabbanyaSietch();
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
  testTerritory({"module": "FalseWallSouth", "neighbors": 7});
}

function testCielagoEast() {
  testTerritory({"module": "CielagoEast", "neighbors": 5});
}

function testOldGap() {
  testTerritory({"module": "OldGap", "neighbors": 6});
}

function testFalseWallWest() {
  testTerritory({"module": "FalseWallWest", "neighbors": 5});
}

function testArrakeen() {
  testTerritory({"module": "Arrakeen", "neighbors": 3});
}

function testCielagoSouth() {
  testTerritory({"module": "CielagoSouth", "neighbors": 3});
}

function testTheGreaterFlat() {
  testTerritory({"module": "TheGreaterFlat", "neighbors": 4});
}

function testWindPassNorth() {
  testTerritory({"module": "WindPassNorth", "neighbors": 4});
}

function testTheGreatFlat() {
  testTerritory({"module": "TheGreatFlat", "neighbors": 4});
}

function testRimWallWest() {
  testTerritory({"module": "RimWallWest", "neighbors": 5});
}

function testCielagoWest() {
  testTerritory({"module": "CielagoWest", "neighbors": 7});
}

function testBrokenLand() {
  testTerritory({"module": "BrokenLand", "neighbors": 4});
}

function testPastyMesa() {
  testTerritory({"module": "PastyMesa", "neighbors": 7});
}

function testHoleInTheRock() {
  testTerritory({"module": "HoleInTheRock", "neighbors": 5});
}

function testFuneralPlain() {
  testTerritory({"module": "FuneralPlain", "neighbors": 3});
}

function testBightOfTheCliff() {
  testTerritory({"module": "BightOfTheCliff", "neighbors": 4});
}

function testBasin() {
  testTerritory({"module": "Basin", "neighbors": 4});
}

function testSietchTabr() {
  testTerritory({"module": "SietchTabr", "neighbors": 3});
}

function testRockOutcropping() {
  testTerritory({"module": "RockOutcropping", "neighbors": 4});
}

function testTueksSietch() {
  testTerritory({"module": "TueksSietch", "neighbors": 3});
}

function testSihayaRidge() {
  testTerritory({"module": "SihayaRidge", "neighbors": 4});
}

function testMeridian() {
  testTerritory({"module": "Meridian", "neighbors": 4});
}

function testSouthMesa() {
  testTerritory({"module": "SouthMesa", "neighbors": 5});
}

function testGaraKulon() {
  testTerritory({"module": "GaraKulon", "neighbors": 3});
}

function testRedChasm() {
  testTerritory({"module": "RedChasm", "neighbors": 2});
}

function testHabbanyaRidgeFlat() {
  testTerritory({"module": "HabbanyaRidgeFlat", "neighbors": 5});
}

function testHabbanyaErg() {
  testTerritory({"module": "HabbanyaErg", "neighbors": 3});
}

function testHabbanyaSietch() {
  testTerritory({"module": "HabbanyaSietch", "neighbors": 1});
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
  var troopA = atreides.getTroops(8);
  var troopB = atreides.getTroops(3);

  /* Territory should start empty */
  assert(territory.getFactions().length == 0);

  territory.occupy(troopA);
  assert(territory.getFactions().length == 1);


  var factions = territory.getFactions();
  assert(factions.length == 1);
  assert(factions[0].getSize() == 8,
      "Atriedes occupation is 8 troops");

  territory.occupy(troopB);

  factions = territory.getFactions();
  assert(factions.length == 1,
      "Multiple occupations by same faction combine correctly")
  assert(factions[0].getSize() == 11, "Faction troops combine correctly");

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
  var territoryRef = neighbor1.getNeighbor(territory.constructor.name);

  assert.ok(territoryRef === territory,
      "Territory can pass by reference via getNeighbors()");

}
