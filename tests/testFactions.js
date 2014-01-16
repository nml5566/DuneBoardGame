module.exports = testFactions;

var assert = require("assert");
var DuneGame = require("Dune/Game");
var game = DuneGame();

runTestsIfNotCalledAsModule();

function runTestsIfNotCalledAsModule() {
  if (module.parent) return;
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
  testFaction({"spice": 10, "module": "Atreides"}); 
}

function testBeneGesseritFaction() {
  testFaction({"spice": 5, "module": "BeneGesserit"}); 
}

function testEmperorFaction() {
  testFaction({"spice": 10, "module": "Emperor"}); 
}

function testGuildFaction() {
  testFaction({"spice": 5, "module": "Guild"}); 
}

function testGuildFaction() {
  testFaction({"spice": 5, "module": "Guild"}); 
}

function testHarkonnenFaction() {
  testFaction({"spice": 10, "module": "Harkonnen"}); 
}

function testFaction(obj) {
  var faction = game.newFaction(obj.module);
  faction.module = obj.module;

  testFactionInheritance(faction);

  testFactionTroops(faction);
  testStartingSpice(faction,obj.spice);
}

function testFactionInheritance(faction) {
  var FactionClass = require("Dune/Factions/"+faction.module);

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

  testFactionGetTroops(faction);
  assert.ok(faction.getTroopCount() == 20, faction.name + " starts with 20 troops");
}

function testFactionGetTroops(faction) {
  var troops = faction.getTroops(8);
  assert(troops.getSize() == 8, "Got 8 " + faction.name + " troops");

  assert(troops.getFaction() === faction.constructor.name,
      "Troops know their faction name");
}

function testStartingSpice(faction, count) {
  assert.ok(faction.getSpice() == count, 
      faction.name + " faction starts with " + count + " spice");
}
