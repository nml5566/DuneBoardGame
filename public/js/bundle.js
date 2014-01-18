(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameController = require("Dune/Controller");

window.onload = function() {
 new GameController();

 //var t = require("Dune/Factions/Atreides");
 var DuneGame = require("Dune/Game");
 var game = new DuneGame();
 var faction = game.newFaction('Atreides');
 
 /* DEBUG MODE */
 //var mapView = new MapView(["Atreides","Harkonnen"]);
 //mapView.show();
}




},{"Dune/Controller":2,"Dune/Game":5}],2:[function(require,module,exports){
module.exports = GameController;

var FactionSelectView = require("./Views/FactionSelect");
var StartMenuView = require("./Views/StartMenu");

function GameController() {

  var startMenuView = new StartMenuView();
  var factionSelectView = new FactionSelectView();

  init();

  function init() {
    addPlayClickEvent();
  }

  function addPlayClickEvent() {
    var playButton = document.getElementById("playbutton");
    playButton.onclick = showFactionSelectView;
  }

  function showFactionSelectView() {
    startMenuView.hide();
    factionSelectView.show();
  }

}

},{"./Views/FactionSelect":8,"./Views/StartMenu":10}],3:[function(require,module,exports){
module.exports = AtreidesFaction;

var BaseFaction = require("./Base.js");
AtreidesFaction.prototype = new BaseFaction();
AtreidesFaction.prototype.constructor = AtreidesFaction;

function AtreidesFaction() { 
  this.name = "Atreides";

 this.setLeaders(new Array(
    {"name": "Dr. Yueh", "strength": 1},
    {"name": "Duncan Idaho", "strength": 2},
    {"name": "Gurney Halleck", "strength": 4},
    {"name": "Thufir Hawat", "strength": 5},
    {"name": "Lady Jessica", "strength": 5}
  ));

  this.setSpice(10);
}


},{"./Base.js":4}],4:[function(require,module,exports){
module.exports = BaseFaction;

function BaseFaction() {
  this.name = "Base";

  var spice = 0;
  var troops = [];
  var leaders = [];

  assignTroops(troops);
  //assignLeaders(leaders);

  this.getTroopSize = getTroopSize;
  this.getTroops = getTroops;
  this.getSpice = getSpice;
  this.setSpice = setSpice;
  this.getLeaders = getLeaders;
  this.getLeader = getLeader;
  this.setLeaders = setLeaders;

  
  function getTroopSize() {
    return troops.length;
  }

  function getTroops(count) {
    if (count > troops.length) 
      throw Error("Not enough troops");

    var container = new BaseTroopContainer(this, troops.slice(0,count));
    return container;
  };

  function getSpice() {
    return spice;
  };

  function setSpice(value) {
    spice = value;
  }

  function getLeaders() {
    return leaders;
  }

  function getLeader(leaderName) {
    for (var i = 0; i < leaders.length; i++) {
      var leader = leaders[i];
      if (leader.name == leaderName) {
      	return leader;
      }
    } 

    throw new Error(this.name + " leader does not exist: "+leaderName);
  }

  function setLeaders(leaderArray) {
    leaders = leaderArray;
  }

  return this;
}

function assignTroops(troopArray) {
  for (var i = 0; i < 20; i++) {
    troopArray.push(new BaseFactionTroop());
  }
}

function assignLeaders(leaderArray) {
  for (var i = 0; i < 20; i++) {
    leaderArray.push(new BaseFactionTroop());
  }
}

function BaseTroopContainer(faction, troops) {

  var faction = faction.constructor.name;
  var currentLocation = undefined;

  this.getFaction = function() {
    return faction;
  }

  this.getSize = function() {
    return troops.length
  }

  this.getContents = function() {
    return troops;
  }

  this.occupy = function(territory) {
    if (currentLocation !== territory) {
      currentLocation = territory;
      territory.addTroops(this);
    }
  }

  return this;
}

function BaseFactionTroop() {
  var strength = 0.5;

  this.getStrength = function() {
    return strength;
  }

  return this;
}

//function BaseFactionLeader(leaderName, leaderStrength) {
  //var name = leaderName;
  //var strength = leaderStrength;
//}

},{}],5:[function(require,module,exports){
module.exports = Game;

var modulePath = "./Factions";
var AtreidesFaction = require("./Factions/Atreides");
//var AtreidesFaction = require(modulePath + "/Atreides");

function Game() {

  this.newFaction = function(factionModule) {

    //var modulePath = "./Factions/" + factionModule;
    //var modulePath = "./Factions/" + factionModule;
    //var FactionClass = require(modulePath);
    //return new FactionClass();
    return new AtreidesFaction();
  };

  this.getMap = function() {
    var ArrakisMap = require("./Map");
    return new ArrakisMap();
  }

}

},{"./Factions/Atreides":3,"./Map":6}],6:[function(require,module,exports){
module.exports = ArrakisMap;

function ArrakisMap() {
  var cache = {};
  var conflicts = [];

  this.getTerritory = function(territoryName) {

    if (! cache[territoryName]) {
      var territory = _loadTerritoryModule(territoryName);
      cache[territoryName] = territory;

      _trapMapObjectInTerritoryFunctionScope(this, territory);
    }

    return cache[territoryName];
  }

  this.getConflicts = function() {
    return conflicts;
  }

  this.addConflict = function(territory) {

    for (var i = 0; i < conflicts.length; i++) {
      var conflictTerritory = conflicts[i];
      if (conflictTerritory === territory) {
	return;
      }     
    }

    conflicts.push(territory);
  }

  this.clearConflicts = function() {
    conflicts = [];
  }

  function _trapMapObjectInTerritoryFunctionScope(arrakisMap, territory) {
  /* Give territory map cache access without publicly exposing it */
    territory.getMap = function() {
      return arrakisMap;
    };
  }

  function _loadTerritoryModule(territoryName) {
    var Territory = require("./Map/" + territoryName);
    return new Territory();
    
  }

  return this;
}



},{}],7:[function(require,module,exports){
module.exports = BaseView;

function BaseView() {
  var imagePath = "/img/";
  var iconPath = imagePath + "icons/";
  var view = undefined;

  this.getImagePath = getImagePath;
  this.getIconPath = getIconPath
  this.setView = setView;
  this.show = show;
  this.hide = hide;


  function getImagePath() { return imagePath }
  function getIconPath() { return iconPath }
  function setView(element) { view = element }
  function show() { view.style.display = "block" }
  function hide() { view.style.display = "none" }
}


},{}],8:[function(require,module,exports){
module.exports = FactionSelectView;

var BaseView = require("./Base");
var MapView = require("./Map");

FactionSelectView.prototype = new BaseView();
FactionSelectView.prototype.constructor = FactionSelectView;

function FactionSelectView() {

  var container = document.getElementById("factionselectcontainer");

  var factionSelectIcon = "faction-select.png";
  var factionSelect = "faction-select";

  var factions = new Array(
      "Atreides",
      "Fremen",
      "Guild",
      "Emperor",
      "Harkonnen",
      "BeneGesserit",
      factionSelect
  );

  var factionImages = new Array();

  var startButton = undefined;

  var view = document.getElementById("factionselectscreen");

  var me = this;

  init();

  function init() {
    me.setView(view);
    makeFactionImageElements();
    makeBackButtonElement();
    makeStartButtonElement();
  }

  function makeFactionImageElements() {
    for (var i = 0; i < 6; i++) {
      var image = new Image();
      image.src = me.getIconPath() + factionSelectIcon;
      image.onclick = factionSelector;

      container.appendChild(image);
      factionImages.push(image);
    }
  }

  function makeBackButtonElement() {
    var backButton = new Image();
    backButton.src = me.getIconPath() + "back.png";
    container.appendChild(backButton);
    backButton.onclick = returnToStartScreen;

    function returnToStartScreen() {
      var startScreen = document.getElementById("gamestartscreen");
      startScreen.style.display = "block";

      var factionSelectScreen = document.getElementById("factionselectscreen");
      factionSelectScreen.style.display = "none";
    }
  }

  function makeStartButtonElement() {
    startButton = new Image();
    startButton.src = me.getIconPath() + "start.png";
    startButton.style.opacity = 0.6;
    startButton.style.cursor = "default";
    container.appendChild(startButton);
  }


  function factionSelector() {
    var faction = factions.shift();

    if (this.selectedFaction) 
      factions.push(this.selectedFaction);

    if (faction === factionSelect) {
      delete this.selectedFaction; 
      factions.push(factionSelect);
    } else {
      this.selectedFaction = faction;
    }

    this.src = me.getIconPath() + faction + "125x125.png";

    checkIfGameReadyToStart();
  }

  function checkIfGameReadyToStart() {
    if (isGameReadyToStart()) {
      enableStartButton();
    } else {
      disableStartButton();
    }

  }

  function isGameReadyToStart() {
    if (factions.length <= 5) {
      return 1
    } else if (factions.length > 5) {
      return 0
    }
  }

  function enableStartButton() {
    startButton.style.opacity = 1.0;
    startButton.style.cursor = "pointer";
    startButton.onclick = startGame;
  }

  
  function disableStartButton() {
    startButton.style.opacity = 0.6;
    startButton.style.cursor = "default";
    startButton.onclick = null; 
  }

  function startGame() {
    me.hide();
    var factions = getSelectedFactions();
    var mapView = new MapView(factions);
    mapView.show();
  }

  function getSelectedFactions() {
    var factions = new Array();
    for (var i = 0; i < factionImages.length; i++) {
      var image = factionImages[i];
      if (! image.selectedFaction) 
      	continue;

      factions.push(image.selectedFaction);
    }
    return factions;
  }

}


},{"./Base":7,"./Map":9}],9:[function(require,module,exports){
module.exports = MapView;

var BaseView = require("./Base");

MapView.prototype = new BaseView();
MapView.prototype.constructor = MapView;

function MapView(factions) {
// TODO draw storm marker function

  var view = document.getElementById("mapscreen");
  var me = this;

  init();

  function init() {
    me.setView(view);
    initFactions();
  }

  function initFactions() {
    var Dune = require("Dune/Game");
    var dune = Dune();
    //var t = dune.newFaction('Atreides');
    //console.dir(dune);
    //console.dir(t);
    //for (var i = 0; i < factions.length; i++) {
      //var faction = dune.newFaction(factions[i]);
      //displayFactionShield(faction);
    //}
  }

  function displayFactionShield(faction) {
    var shieldImage = new Image();
    //shieldImage.src = me.getImagePath() + "atreides-shield.png";
    shieldImage.src = me.getImagePath() + "fake-shield.png";
    shieldImage.alt = faction.name + " turn";
    shieldImage.style.cursor = "pointer";
    shieldImage.style.color = "white";
    shieldImage.style.fontSize = "100px";
    shieldImage.style.textShadow = 
      "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
    
    shieldImage.onclick = function() {
      view.removeChild(shieldImage);
    }

    view.appendChild(shieldImage);
  }
}

},{"./Base":7,"Dune/Game":5}],10:[function(require,module,exports){
module.exports = StartMenuView;

var BaseView = require('./Base');

StartMenuView.prototype = new BaseView();
StartMenuView.prototype.constructor = StartMenuView;

function StartMenuView() {

  var view = document.getElementById("gamestartscreen");

  this.show = hide;
  this.hide = hide;

  function show() {
    view.style.display = "block";
  }

  function hide() {
    view.style.display = "none";
  }
}


},{"./Base":7}]},{},[1])