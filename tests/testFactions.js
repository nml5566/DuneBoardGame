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
  testCommonFactionAttributes({"spice": 0, "module": "Base"}); 
}

function testAtreidesFaction() {
  testCommonFactionAttributes({"spice": 10, "module": "Atreides"}); 
}

function testBeneGesseritFaction() {
  testCommonFactionAttributes({"spice": 5, "module": "BeneGesserit"}); 
}

function testEmperorFaction() {
  testCommonFactionAttributes({"spice": 10, "module": "Emperor"}); 
}

function testGuildFaction() {
  testCommonFactionAttributes({"spice": 5, "module": "Guild"}); 
}

function testGuildFaction() {
  testCommonFactionAttributes({"spice": 5, "module": "Guild"}); 
}

function testHarkonnenFaction() {
  testCommonFactionAttributes({"spice": 10, "module": "Harkonnen"}); 
}

function testCommonFactionAttributes(obj) {
  var faction = game.newFaction(obj.module);
  faction.module = obj.module;

  testFactionInheritance(faction);

  testStartingTroops(faction);
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

function testStartingTroops(faction) {
  assert.ok(faction.getTroopCount() == 20, faction.name + " starts with 20 troops");
}

function testStartingSpice(faction, count) {
  assert.ok(faction.getSpice() == count, 
      faction.name + " faction starts with " + count + " spice");
}
