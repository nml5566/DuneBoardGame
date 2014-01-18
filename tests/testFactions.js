module.exports = testFactions;

var assert = require("assert");
var DuneGame = require("Dune/Game");
var game = DuneGame();

runTestsIfNotCalledAsModule();

function runTestsIfNotCalledAsModule() {
  if (module.parent) 
    return;

  testFactions();
}

function testFactions() {
  testBaseFaction();
  testAtreidesFaction();
  testBeneGesseritFaction();
  testEmperorFaction();
  testGuildFaction();
  testHarkonnenFaction();
}

function testBaseFaction() {
  testFaction({"spice": 0, "module": "Base"}); 
}

function testAtreidesFaction() {
  testFaction({"spice": 10, "module": "Atreides", 
    "leader": ["Gurney Halleck", 4] }); 
}

function testBeneGesseritFaction() {
  testFaction({"spice": 5, "module": "BeneGesserit",
    "leader": ["Alia", 5] }); 
}

function testEmperorFaction() {
  testFaction({"spice": 10, "module": "Emperor",
    "leader": ["Caid", 3] }); 
}

function testGuildFaction() {
  testFaction({"spice": 5, "module": "Guild",
    "leader": ["Guild Rep.", 1] }); 
}

function testHarkonnenFaction() {
  testFaction({"spice": 10, "module": "Harkonnen",
    "leader": ["Feyd Rautha", 6] }); 
}

function testFaction(obj) {
  var faction = game.newFaction(obj.module);
  faction.module = obj.module;

  testFactionInheritance(faction);

  testFactionTroops(faction);
  testStartingSpice(faction,obj.spice);
  testFactionLeaders(faction, obj.leader);
}

function testFactionInheritance(faction) {
  var FactionClass = require("Dune/Factions/"+faction.module);

  assert.ok(faction.constructor.name === faction.module+"Faction", 
      faction.module + " constructor name matches its class name");

  testFactionBaseInheritance(faction);
  assert.ok(faction instanceof FactionClass,
      faction.name + " faction inherts from " + faction.module + " class");
}

function testFactionBaseInheritance(faction) {
  var BaseFaction = require("Dune/Factions/Base");
  assert.ok(faction instanceof BaseFaction,
      faction.name + " faction inherts from base class");
}

function testFactionTroops(faction) {

  assert.ok(faction.getTroopSize() == 20, faction.name + " starts with 20 troops");

  testFactionGetTroops(faction);
  testFactionGetTooManyTroops(faction);
}

function testFactionGetTroops(faction) {
  var troop = faction.getTroops(8);
  assert(troop.getSize() == 8, "Got 8 " + faction.name + " troops");

  assert(troop.getFaction() === faction.constructor.name,
      "Troops know their faction name");
}

function testFactionGetTooManyTroops(faction) {
  assert.throws(
    function() {
      faction.getTroops(21);
    },
    function(err) {
      if (err instanceof Error) {
	return true;
      }
    },
    "Asking for more that available troops throws error."
  );
}

function testStartingSpice(faction, count) {
  assert.ok(faction.getSpice() == count, 
      faction.name + " faction starts with " + count + " spice");
}

function testFactionLeaders(faction, expectedLeader) {
  /* BaseFaction doesn't have leaders, so don't test it */
  if (faction.constructor.name == "BaseFaction")
    return;

  var leaders = faction.getLeaders();
  assert(leaders.length == 5, faction.name + " has 5 leaders");

  var leader = faction.getLeader(expectedLeader[0]);
  assert(leader.name == expectedLeader[0], "Got expected leader");
  assert(leader.strength == expectedLeader[1], "Got expected leader strength");
}
