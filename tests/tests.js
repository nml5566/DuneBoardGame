var assert = require("assert");
var DuneGame = require("Dune/Game");
var game = DuneGame();


testFactions();

function testFactions() {
  testBaseFaction();
  testAtreidesFaction();
  testBeneGesseritFaction();
  testEmperorFaction();
  testGuildFaction();
  //testHarkonnen();
}

function testBaseFaction() {
  runCommonTests({"spice": 0, "module": "Base"}); 
}

function testAtreidesFaction() {
  runCommonTests({"spice": 10, "module": "Atreides"}); 
}

function testBeneGesseritFaction() {
  runCommonTests({"spice": 5, "module": "BeneGesserit"}); 
}

function testEmperorFaction() {
  runCommonTests({"spice": 10, "module": "Emperor"}); 
}

function testGuildFaction() {
  runCommonTests({"spice": 5, "module": "Guild"}); 
}

function testGuildFaction() {
  runCommonTests({"spice": 10, "module": "Harkonnen"}); 
}

function runCommonTests(obj) {
  var faction = game.getFaction(obj.module);
  faction.module = obj.module;

  testFactionInstances(faction);

  testStartingTroops(faction);
  testStartingSpice(faction,obj.spice);
}

function testFactionInstances(faction) {
  var FactionClass = require("Dune/Factions/"+faction.module);

  testFactionBaseInstance(faction);
  assert.ok(faction instanceof FactionClass,
      faction.name + " faction inherts from " + faction.module + " class");
}

function testFactionBaseInstance(faction) {
  var BaseFaction = require("Dune/Factions/Base");
  assert.ok(faction instanceof BaseFaction,
      faction.name + " faction inherts from base class");
}

function testStartingTroops(faction) {
  assert.ok(faction.getTroops() == 20, faction.name + " starts with 20 troops");
}

function testStartingSpice(faction, count) {
  assert.ok(faction.getSpice() == count, 
      faction.name + " starts with " + count + " spice");
}
