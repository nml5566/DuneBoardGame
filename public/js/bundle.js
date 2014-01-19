(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.debugSetFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();
}




},{"Dune/Controller":2}],2:[function(require,module,exports){
module.exports = GameController;

var DuneGame = require("Dune/Game");
var MapView = require("./View/Map");
var StartMenuView = require("./View/StartMenu");
var FactionSelectView = require("./View/FactionSelect");

function GameController() {

  var factions = [];
  var views = {
    "map": new MapView(this),
    "start": new StartMenuView(this),
    "select":new FactionSelectView(this),
    "factions": []
  };
  var turn = 0;
  var traitorPool = new Array();
  var that = this;

  this.game = new DuneGame();

  //getStartMenuView();

/*  function getStartMenuView() {*/
    //if (! views.startMenu) {
    //}

    //return views.startMenu

  /*}*/

  this.startGame = function() {

    views.select.hide();
    //hideFactionSelectView();
    //initNewGame();
    initFactionViews();
    this.game.start();
    initMapView();
    //shuffleTurnOrder();
    //makeTraitorPool();
    startInitialTurn();
  }

/*  this.hideStartMenuView = function() {*/
    //var startMenuView = getStartMenuView();
    //startMenuView.hide();
  //}

  //this.showFactionSelectView = function() {
    //var factionSelectView = this.getFactionSelectView();
    //factionSelectView.show();
  /*}*/

  function initFactionViews() {
    var factionViews = new Array();

    for (var i = 0; i < factions.length; i++) {
      var FactionView = getFactionViewConstructor(factions[i]);
      views.factions.push(new FactionView(that));
    }

    setFactionViews(factionViews);
  }

  function getFactionViewConstructor(factionName) {
    switch(factionName) {
      case "Atreides":
      	return require("./View/Faction/Atreides");
      case "Harkonnen":
      	return require("./View/Faction/Harkonnen");
      case "BeneGesserit":
      	return require("./View/Faction/BeneGesserit");
      case "Fremen":
      	return require("./View/Faction/Fremen");
      case "Guild":
      	return require("./View/Faction/Guild");
      case "Emperor":
      	return require("./View/Faction/Emperor");
      default:
      	throw new Error("Invalid faction view: "+factionName);
    }
  }

  function setFactionViews(array) {
    views.factions = array;
  }

  function initMapView() {
    views.map.show();
    views.map.drawStorm();
  }

  this.debugSetFactions = function (factionsArray) {
  /* This is a debug function and should go away once gameplay finalized */
    factions = factionsArray;
  }

  function startInitialTurn() {
    //console.log('starting initial turn');
    //makeTraitorPool();
    //var factionView = getNextTurnOrder();
    //factionView.startInitialTurn();
  }

}

},{"./View/Faction/Atreides":13,"./View/Faction/BeneGesserit":15,"./View/Faction/Emperor":16,"./View/Faction/Fremen":17,"./View/Faction/Guild":18,"./View/Faction/Harkonnen":19,"./View/FactionSelect":20,"./View/Map":21,"./View/StartMenu":22,"Dune/Game":10}],3:[function(require,module,exports){
module.exports = AtreidesFaction;

var internalDecorator = require("./Base.js");
//AtreidesFaction.prototype = new BaseFaction();
//AtreidesFaction.prototype.constructor = AtreidesFaction;

function AtreidesFaction(game) { 

 var leaders = new Array(
    {"name": "Dr. Yueh", "strength": 1},
    {"name": "Duncan Idaho", "strength": 2},
    {"name": "Gurney Halleck", "strength": 4},
    {"name": "Thufir Hawat", "strength": 5},
    {"name": "Lady Jessica", "strength": 5}
  );

  internalDecorator(this, 
      {"spice": 10, "leaders": leaders, "name": "Atreides", "game": game});


  //this.setSpice(10);
}


},{"./Base.js":4}],4:[function(require,module,exports){
module.exports = BaseFaction;

function BaseFaction(obj, props) {

  var name = props.name;
  var spice = props.spice; 
  var leaders = props.leaders; 
  var game = props.game; 
  var troops = props.troops || assignTroops();
  var traitor = undefined;
  var traitorHand = undefined;
  var handLimit = props.handLimit || 4;
  var treacheryHand = [];

  function getTroopSize() {
    return troops.length;
  }

  obj.getTroops = function (count) {
    if (count > troops.length) 
      throw Error("Not enough troops");

    var container = new BaseTroopContainer(this, troops.slice(0,count));
    return container;
  };

  obj.leaders = function() {
    return leaders;
  }

  obj.drawTraitorHand = function () {
    return traitorHand = game.dealTraitorHand();
  }

  obj.pickTraitorFromHand = function(position) {
    return traitor = traitorHand[position];
  }

  obj.drawTreacheryCard = function() {
    if (obj.isAtHandLimit()) 
      throw new Error("Hand limit reached!");

    var treacheryCard = game.dealTreacheryCard();
    treacheryHand.push(treacheryCard);
  }

  obj.isAtHandLimit = function() {
    return treacheryHand.limit == handLimit
  }

}

/*function BaseFactionBak() {*/
  //this.name = "Base";

  //var spice = 0;
  //var troops = [];
  //var leaders = [];
  //var traitor = undefined;

  //assignTroops(troops);

  //this.getTroopSize = getTroopSize;
  //this.getTroops = getTroops;
  //this.getSpice = getSpice;
  //this.setSpice = setSpice;
  //this.getLeaders = getLeaders;
  //this.getLeader = getLeader;
  //this.setLeaders = setLeaders;

  
  //function getTroopSize() {
    //return troops.length;
  //}

  //function getTroops(count) {
    //if (count > troops.length) 
      //throw Error("Not enough troops");

    //var container = new BaseTroopContainer(this, troops.slice(0,count));
    //return container;
  //};

  //function getSpice() {
    //return spice;
  //};

  //function setSpice(value) {
    //spice = value;
  //}

  //function getLeaders() {
    //return leaders;
  //}

  //function getLeader(leaderName) {
    //for (var i = 0; i < leaders.length; i++) {
      //var leader = leaders[i];
      //if (leader.name == leaderName) {
              //return leader;
      //}
    //} 

    //throw new Error(this.name + " leader does not exist: "+leaderName);
  //}

  //function setLeaders(leaderArray) {
    //leaders = leaderArray;
  //}

  //this.setTraitor = function(traitorName) {
    //return traitor = traitorName;
  //}

/*}*/

function assignTroops(troopArray) {
  var array = new Array();
  for (var i = 0; i < 20; i++) {
    array.push(new BaseFactionTroop());
  }
  return array;
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

},{}],5:[function(require,module,exports){
module.exports = BeneGesseritFaction;

var BaseFaction = require("./Base.js");
BeneGesseritFaction.prototype = new BaseFaction();
BeneGesseritFaction.prototype.constructor = BeneGesseritFaction;

function BeneGesseritFaction() { 
  this.name = "Bene Gesserit";

 this.setLeaders(new Array(
    {"name": "Alia", "strength": 5},
    {"name": "Wanna Marcus", "strength": 5},
    {"name": "Princess Irulan", "strength": 5},
    {"name": "Margot Lady Fenring", "strength": 5},
    {"name": "Mother Ramallo", "strength": 5}
  ));

  this.setSpice(5);
}

},{"./Base.js":4}],6:[function(require,module,exports){
module.exports = EmperorFaction;

var BaseFaction = require("./Base.js");
EmperorFaction.prototype = new BaseFaction();
EmperorFaction.prototype.constructor = EmperorFaction;

function EmperorFaction() { 
  this.name = "Emperor";

  this.setLeaders(new Array(
    {"name": "Bashar", "strength": 2},
    {"name": "Burseg", "strength": 3},
    {"name": "Caid", "strength": 3},
    {"name": "Captain Arasham", "strength": 5},
    {"name": "Hasmir Fenring", "strength": 6}
  ));

  this.setSpice(10);
}

},{"./Base.js":4}],7:[function(require,module,exports){
module.exports = FremenFaction;

var BaseFaction = require("./Base.js");
FremenFaction.prototype = new BaseFaction();
FremenFaction.prototype.constructor = FremenFaction;

function FremenFaction() { 
  this.name = "Fremen";

 this.setLeaders(new Array(
    {"name": "Jamis", "strength": 2},
    {"name": "Shadout Mapes", "strength": 3},
    {"name": "Otheym", "strength": 5},
    {"name": "Chani", "strength": 6},
    {"name": "Stilgar", "strength": 7}
  ));

  this.setSpice(3);
}


},{"./Base.js":4}],8:[function(require,module,exports){
module.exports = GuildFaction;

var FactionDecorator = require("./Base.js");

function GuildFaction(game) { 
  this.name = "Guild";
  var leaders = new Array(
    {"name": "Guild Rep.", "strength": 1},
    {"name": "Soo-Soo Sook", "strength": 2},
    {"name": "Esmar Tuek", "strength": 3},
    {"name": "Master Bewt", "strength": 3},
    {"name": "Staban Tuek", "strength": 5}
  );

  FactionDecorator(this,
      {"spice": 5, "leaders": leaders, "name": "Spacing Guild", "game": game});
}

},{"./Base.js":4}],9:[function(require,module,exports){
module.exports = HarkonnenFaction;

var internalDecorator = require("./Base.js");
//HarkonnenFaction.prototype = new internalDecorator();
//HarkonnenFaction.prototype.constructor = HarkonnenFaction;

function HarkonnenFaction(game) { 
  var leaders = new Array(
    {"name": "Umman Kudu", "strength": 1},
    {"name": "Captain Iakin Nefud", "strength": 2},
    {"name": "Piter De Vries", "strength": 3},
    {"name": "Beast Rabban", "strength": 4},
    {"name": "Feyd Rautha", "strength": 6}
  );

  internalDecorator(this, 
      {"spice": 10, "leaders": leaders, "name": "Harkonnen", "game": game, 
      	"handLimit": 8});

}

},{"./Base.js":4}],10:[function(require,module,exports){
module.exports = Game;

var ArrakisMap = require("./Map");
var shuffleArray = require("./shuffle");

function Game() {

  var round = 0;

  var isStarted = false,
      factions = { },
      playerSeat = { },
      stormQuadrant,
      traitorPool;

  var treacheryDeck = TreacheryDeck();
  this.map = new ArrakisMap();

  this.start = function() {
    isStarted = true;
    assignPlayerSeats();
    shuffleArray(treacheryDeck);
    makeTraitorPool();
  }

  function makeTraitorPool() {
  /* Generate a pool of traitors that each player will choose from */
    var allLeaders = new Array();
    for (var factionName in factions) {
      var faction = factions[factionName];
      var factionLeaders = faction.leaders();
      allLeaders = allLeaders.concat(factionLeaders);
    }

    shuffleArray(allLeaders);
    traitorPool = allLeaders;
  }


  this.selectPlayer = function(factionName) {
    if (isStarted) {
      throw new Error("Game already started. Unable to add more factions");
    }

    if (factions[factionName]) 
      throw new Error(factionName + " faction has already been selected").stack;

    var FactionModule = getFactionModule(factionName);
    return factions[factionName] = new FactionModule(this);
  }

  function getFactionModule(factionName) {
    switch(factionName) {
      case "Atreides":
	return require("./Faction/Atreides");
      case "BeneGesserit":
	return require("./Faction/BeneGesserit");
      case "Harkonnen":
	return require("./Faction/Harkonnen");
      case "Fremen":
	return require("./Faction/Fremen");
      case "Guild":
	return require("./Faction/Guild");
      case "Emperor":
	return require("./Faction/Emperor");
      default:
      	throw new Error("Invalid faction: " + factionName);
    }
  }

  function assignPlayerSeats() {
    var playerSeatQuadrants = new Array(0, 3, 6, 9, 12, 15);
    shuffleArray(playerSeatQuadrants);

    for (var name in factions) {
      var faction = factions[name];
      faction.seat = playerSeatQuadrants.shift();
    }
  }

  this.dealTraitorHand = function() {

    return traitorPool.splice(0,4);
  }

  this.dealTreacheryCard = function() {
  }

  this.stormRound = function () {
    return stormQuadrant = this.map.moveStorm();
  }

  this.spiceBlowRound = function() {
    return this.map.spiceBlow();
  }

  this.getTurnOrder = function() {
    var turnOrder = new Array();
    for (var name in factions) {
      var faction = factions[name];
      turnOrder.push(faction);
    }

    /* Storms on the same quadrant as player are considered ahead of it 
    /* so round up to illustrate this and prevent equal sorting problems */
    var tempQuadrant = stormQuadrant + 0.5
    return turnOrder.sort(function sortCounterClockwiseAheadOfStorm(a,b) { 

      if (tempQuadrant > a.seat && tempQuadrant < b.seat) {
      	return true;
      } else if (tempQuadrant < a.seat && tempQuadrant > b.seat) {
      	return false;
      } else {
      	return a.seat - b.seat
      }
    });
  }

  this.battleRound = function() {
  }

  this.collectionRound = function() {
  }

  this.controlRound = function() {
    round++;
  }

  this.isOver = function() {
    return round == 15
  }
}

function TreacheryDeck() {
  return new Array();
}


},{"./Faction/Atreides":3,"./Faction/BeneGesserit":5,"./Faction/Emperor":6,"./Faction/Fremen":7,"./Faction/Guild":8,"./Faction/Harkonnen":9,"./Map":11,"./shuffle":23}],11:[function(require,module,exports){
module.exports = ArrakisMap;

var shuffleArray = require("./shuffle");

function ArrakisMap() {
  var cache = {};
  var conflicts = [];
  var stormDeck = [];

  /* Quadrants start at top of map and number 0 to 17 counterclockwise */
  var stormQuadrant;
  var quadrants = 17;


  this.initStormPosition = function() {
    return stormQuadrant = Math.floor((Math.random()*quadrants)+0);
  }

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

  this.moveStorm = function() {
    if (! stormDeck.length) {
      stormDeck = StormDeck();
      shuffleArray(stormDeck);
    }

    var stormMovement = stormDeck.shift();

    /* Storm moves counterclockwise */
    stormQuadrant += stormMovement;

    /* Reset storm quandrant position when it goes below 0 */
    if (stormQuadrant > 17)
      stormQuadrant -= quadrants;

    return stormQuadrant;
  }

  this.spiceBlow = function() {
  }

  return this;
}

function StormDeck() {
  return new Array( 1, 2, 3, 4, 5, 6 );
}


function SpiceDeck() {
  return new Array();
}

},{"./shuffle":23}],12:[function(require,module,exports){
module.exports = BaseView;

function BaseView() {
  var imagePath = "/img/";
  var iconPath = imagePath + "icons/";
  var view = undefined;

  this.getImagePath = getImagePath;
  this.getIconPath = getIconPath
  this.getView = getView;
  this.setView = setView;
  this.show = show;
  this.hide = hide;


  function getImagePath() { return imagePath }
  function getIconPath() { return iconPath }
  function getView(element) { return view }
  function setView(element) { view = element }
  function show() { view.style.display = "block" }
  function hide() { view.style.display = "none" }
}


},{}],13:[function(require,module,exports){
module.exports = AtreidesView;

var BaseFactionView = require("./Base");

AtreidesView.prototype = new BaseFactionView();
AtreidesView.prototype.constructor = AtreidesView;

function AtreidesView(controller) {

  var faction = controller.game.selectPlayer('Atreides');
  var that = this;

  this.setController(controller);
  this.setFaction(faction);

  this.startInitialTurn = function() {
    this.promptUserStartTurn();
  }

  this._startInitialTurn = function() {
    this.promptUserSelectTraitor();
    //this.deployInitialTroops()
  }


  // TODO change variable require in Dune/Map
  //this.deployInitialTroops = function() {
    //var map = game.getMap();
    //var Arrakeen = map.getTerritory("Arrakeen");

    //var troops = faction.getTroops(10);
    //troops.occupy(Arrakeen);
  //}

}

},{"./Base":14}],14:[function(require,module,exports){
module.exports = BaseFactionView;

var BaseView = require("../Base");
BaseFactionView.prototype = new BaseView();
BaseFactionView.prototype.constructor = BaseFactionView;

function BaseFactionView() {

  var controller, faction;

  var self = this;

  this.setFaction = function(newFaction) {
    faction = newFaction;
  }

  this.setController = function(newController) {
    controller = newController
  }

  this.getController = function() { return controller }

  this.promptUserStartTurn = function() {
    var that = this;

    var viewElement = getMapViewElement();

    var shieldImage = new Image();
    // TODO set shield image source when assets are in place
    shieldImage.alt = faction.name + " turn";
    shieldImage.style.cursor = "pointer";
    shieldImage.style.color = "black";
    shieldImage.style.backgroundColor = "white";
    shieldImage.style.fontSize = "100px";
    
    shieldImage.onclick = dismissUserStartPrompt;

    function dismissUserStartPrompt() {
      viewElement.removeChild(this);
      that._startInitialTurn();
    }

    viewElement.appendChild(shieldImage);
  }

  function getMapViewElement() {
    var controller = self.getController();
    var mapView = controller.getMapView();
    var viewElement = mapView.getView();
    return viewElement;
  }

  this._startInitialTurn = function() {
    throw new Error('Method must be implemented by child class');
  }

  this.getLeaders = function() {
    return faction.getLeaders();
  }

  this.promptUserSelectTraitor = function() {
    var controller = this.getController();
    var traitorHand = controller.dealTraitorHand();
    displayTraitorCards(traitorHand);

  }

  function displayTraitorCards(traitorHand) {
    var mapViewElement = getMapViewElement();

    var traitorSelectionContainer = document.createElement("div");
    var title = document.createElement("p");

    var titleText = document.createTextNode("Choose a traitor");
    title.style.color = "black";
    title.style.backgroundColor = "white";
    title.style.fontSize = "50px";

    title.appendChild(titleText);
    traitorSelectionContainer.appendChild(title);
    mapViewElement.appendChild(traitorSelectionContainer);

    makeTraitorCardImages(traitorHand, traitorSelectionContainer);


  }

  function makeTraitorCardImages(traitorHand, traitorSelectionContainer) {
    var mapViewElement = getMapViewElement();

    var traitorCardImages = new Array();

    for (var i = 0; i < traitorHand.length; i++) {
      var traitorCard = traitorHand[i];

      var traitorCardImage = new Image();
      traitorCardImage.alt = traitorCard.name;
      traitorCardImage.style.cursor = "pointer";
      traitorCardImage.style.color = "black";
      traitorCardImage.style.backgroundColor = "white";
      traitorCardImage.style.fontSize = "100px";

      traitorCardImage.onclick = function() {
      	self.selectTraitor(traitorCardImage.alt);
	mapViewElement.removeChild(traitorSelectionContainer);
      }

      traitorCardImages.push(traitorCardImage);

      traitorSelectionContainer.appendChild(traitorCardImage);
    }

  }

  this.selectTraitor = function(traitorName) {
    faction.setTraitor(traitorName);
  }

}

},{"../Base":12}],15:[function(require,module,exports){

},{}],16:[function(require,module,exports){
module.exports=require(15)
},{}],17:[function(require,module,exports){
module.exports = FremenView;

var BaseFactionView = require("./Base");
var DuneGame = require("Dune/Game");

FremenView.prototype = new BaseFactionView();
FremenView.prototype.constructor = FremenView;

function FremenView(controller) {

  var game = controller.getGame();
  var faction = game.newFaction("Fremen");
  var that = this;

  this.setController(controller);

  this.startInitialTurn = function() {
    this.signalTurnStart(faction);
  }

}

},{"./Base":14,"Dune/Game":10}],18:[function(require,module,exports){
module.exports=require(15)
},{}],19:[function(require,module,exports){
module.exports = HarkonnenView;

var BaseFactionView = require("./Base");

HarkonnenView.prototype = new BaseFactionView();
HarkonnenView.prototype.constructor = HarkonnenView;

function HarkonnenView(controller) {

  var faction = controller.game.selectPlayer('Harkonnen');
  var that = this;

  this.setController(controller);
  this.setFaction(faction);

  this.startInitialTurn = function() {
    this.promptUserStartTurn();
  }

  this._startInitialTurn = function() {
    this.promptUserSelectTraitor();
  }


}

},{"./Base":14}],20:[function(require,module,exports){
module.exports = FactionSelectView;

var BaseView = require("./Base");
var MapView = require("./Map");

FactionSelectView.prototype = new BaseView();
FactionSelectView.prototype.constructor = FactionSelectView;

function FactionSelectView(controller) {

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

  var that = this;

  init();

  function init() {
    that.setView(view);
    that.getSelectedFactions = getSelectedFactions;
    makeFactionImageElements();
    makeBackButtonElement();
    makeStartButtonElement();
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

  function makeFactionImageElements() {
    for (var i = 0; i < 6; i++) {
      var image = new Image();
      image.src = that.getIconPath() + factionSelectIcon;
      image.onclick = factionSelector;

      container.appendChild(image);
      factionImages.push(image);
    }
  }

  function makeBackButtonElement() {
    var backButton = new Image();
    backButton.src = that.getIconPath() + "back.png";
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
    startButton.src = that.getIconPath() + "start.png";
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

    this.src = that.getIconPath() + faction + "125x125.png";

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
    startButton.onclick = startClick;
  }

  function startClick() {
    var factions = that.getSelectedFactions()
    controller.debugSetFactions(factions);
    controller.startGame();
  }

  function disableStartButton() {
    startButton.style.opacity = 0.6;
    startButton.style.cursor = "default";
    startButton.onclick = null; 
  }

}


},{"./Base":12,"./Map":21}],21:[function(require,module,exports){
module.exports = MapView;

var BaseView = require("./Base");

MapView.prototype = new BaseView();
MapView.prototype.constructor = MapView;

function MapView(controller) {

  var canvas = document.getElementById("gamecanvas");
  canvas.width = 768;
  canvas.height = 1024;

  var view = document.getElementById("mapscreen");

  var context = canvas.getContext("2d");

  var quadrantCoordinates = new Array(
    [360, 60], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
  );


  var that = this;

  var stormImage = makeStormImage();

  var circle = {centerX:385, centerY:425, radius:338, angle:0}
  var ball = {x:stormImage.x, y:stormImage.y, speed:stormImage.speed, 
    radius:stormImage.radius};

  function makeStormImage() {
    var stormImageUrl = "img/icons/storm-marker.png";
    var stormImage = new Image();

    stormImage.src = stormImageUrl;
    stormImage.x = 0; 
    stormImage.y = 0; 
    stormImage.speed = .01; 
    stormImage.radius = 25;

    stormImage.onload = function() {
      drawScreen();
    }

    return stormImage;
  }

  init();

  function init() {
    that.setView(view);
  }

  this.drawStorm = function() {
    var stormQuadrant = controller.game.map.initStormPosition();
    console.log("storm quadrant: "+stormQuadrant);

  }

  function  drawScreen () {
      //Clear last ball drawn
      context.clearRect(
	ball.x - ball.radius, ball.y - ball.radius, ball.radius*2, ball.radius*2);

      //context.fillStyle = '#EEEEEE';
      //context.fillRect(0, 0, canvas.width, canvas.height);
      //Box
      //context.strokeStyle = '#000000';
      //context.strokeRect(1,  1, canvas.width-2, canvas.height-2);

      ball.x = circle.centerX + Math.cos(circle.angle) * circle.radius;
      ball.y = circle.centerY + Math.sin(circle.angle) * circle.radius;

      circle.angle -= ball.speed;


      context.drawImage(stormImage, ball.x - ball.radius, ball.y - ball.radius);
      /* Draw ball */
/*      context.fillStyle = "#000000";*/
      //context.beginPath();

      //var startAngle = 0;
      //var endAngle = Math.PI*2;
      //context.arc(ball.x,ball.y, ball.radius, startAngle, endAngle, true);

      //context.closePath();
      /*context.fill();*/

      //context.strokeStyle = 'red';
      //context.strokeRect(
      //context.clearRect(
	//ball.x - ball.radius, ball.y - ball.radius, ball.radius*2, ball.radius*2);

   }

}

},{"./Base":12}],22:[function(require,module,exports){
module.exports = StartMenuView;

var BaseView = require('./Base');

StartMenuView.prototype = new BaseView();
StartMenuView.prototype.constructor = StartMenuView;

function StartMenuView(controller) {

  var view = document.getElementById("gamestartscreen");

  this.setView(view);
  var that = this;

  addPlayClickEvent();

  function addPlayClickEvent() {
    var playButton = document.getElementById("playbutton");
    playButton.onclick = showFactionSelectView;
  }

  function showFactionSelectView() {
    controller.hideStartMenuView();
    controller.showFactionSelectView();
    //that.hide();
    //var factionSelectView = controller.getFactionSelectView();
    //factionSelectView.show();
  }

}


},{"./Base":12}],23:[function(require,module,exports){
module.exports = shuffleArray;

function shuffleArray(array) {
  var currentIndex = array.length, 
      temporaryValue, 
      randomIndex;
  
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    //Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

},{}]},{},[1])