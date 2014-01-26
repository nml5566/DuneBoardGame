(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var gameController = require("Dune/Controller");

window.onload = function() {
  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  //loadRoundHighlightMarkers();
  //highlightStormRound();
}


var Loader = require("Dune/Loader");
var loader = new Loader();
var canvasContainer = require("Dune/CanvasContainer");
var roundCanvas = canvasContainer.layer('roundscreen');
var roundCtx = roundCanvas.getContext("2d");

var roundMarkers = {
  "storm": {"x": 174}, 
  "spiceblow": {"x": 221}, 
  "bidding": {"x": 269}, 
  "movement": {"x": 457},
  "battle": {"x": 504},
  "collection": {"x": 552}
};

function loadRoundHighlightMarkers() 
{

  for (var m in roundMarkers) {
    var url = "/img/rounds/" + m + ".png";
    roundMarkers[m].img = loader.loadImage(url);
  }


  loader.onload = drawRoundMarkers;
}

function drawRoundMarkers() 
{
  setRoundMarkerDimensions();

  for (var marker in roundMarkers) {
    var props = roundMarkers[marker];
    var img = props.img;

    roundCtx.drawImage(
      img,
      img.xPos, img.yPos,
      img.width, img.height);

  }
}


function setRoundMarkerDimensions() 
{
  var markerScale = 43;
  var yPos = 21;

  for (var marker in roundMarkers) {
    var props = roundMarkers[marker];
    var img = props.img;
    img.xPos = props.x;
    img.yPos = yPos;
    img.width = img.height = markerScale;
  }
}

function highlightStormRound() {

  var roundMarkerUrl = "/img/rounds/storm.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 174;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightSpiceBlowRound() {

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 221;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightBiddingRound() {
  var roundMarkerUrl = "/img/rounds/bidding.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 269;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

function highlightMovementRound() {
  var roundMarkerUrl = "/img/rounds/movement.png";
  var roundMarkerImg = loader.loadImage(roundMarkerUrl);

  var markerScale = 43;

  loader.onload = function() {
    var xPos = 317;
    var yPos = 21;
    roundCtx.drawImage(roundMarkerImg, xPos, yPos, markerScale, markerScale);
  }
}

},{"Dune/CanvasContainer":2,"Dune/Controller":3,"Dune/Loader":14}],2:[function(require,module,exports){
module.exports = new CanvasContainer;

function CanvasContainer() 
{

  var container = document.getElementById("gamecontainer");

  var layerMap = { };
  
  this.layer = function(layerName) {
    if (! layerMap[layerName]) 
      newLayer(layerName);

    return layerMap[layerName]
  }

  function newLayer(layerName) {
    var canvas = document.createElement("canvas");

    layerMap[layerName] = canvas;
    setCanvasAttributes(canvas, layerName);

    container.appendChild(canvas);
  }

  function setCanvasAttributes(canvas, layerName) {
    var zIndex = zIndexLookup(layerName);

    canvas.id = layerName;
    canvas.className = "gamelayer";
    canvas.style.display = "block";
    canvas.style.zIndex = zIndex;
    canvas.width = 768;
    canvas.height = 1024;

    if (layerName == "test")
      canvas.style.display = "none";

  }

  function zIndexLookup(layerName) 
  {
    switch (layerName) {
      case "notification":
      	return 200;
      case "playerscreen":
      	return 99;
      case "troopscreen":
      	return 98;
      case "playerseat":
      	return 97;
      case "storm":
      	return 96;
      case "turnscreen":
      	return 96;
      case "roundscreen":
      	return 96;
      case "test":
      	return 94;
      default:
      	return 99;
              //throw new Error("No zIndex case defined for " + layerName);
    }
  }

  this.deleteLayer = function(canvas) 
  {
    delete layerMap[canvas.id];
    if (canvas.parentNode === container)
      container.removeChild(canvas);
  }
}


},{}],3:[function(require,module,exports){
var Loader = require("./Loader");
var canvasContainer = require("./CanvasContainer");

var gameView = require("./View/Game");
var StartMenuView = require("./View/StartMenu");
var FactionSelectView = require("./View/FactionSelect");
var mapView = require("./View/Map");
var roundView = require("Dune/View/Round");

module.exports = new GameController();

function GameController() {

  var factionViews = {};
  var turnOrder;

  this.startGame = function() 
  {
    gameView.game.start();
    turnOrder = gameView.game.getTurnOrder();

    hideFactionSelectView();
    initViews();
    this.nextPlayerSetupTurn();
  }

  this.nextGameTurn = function() { this.nextPlayerSetupTurn() }

  function hideFactionSelectView()
  {
    var factionSelectView = new FactionSelectView();
    factionSelectView.hide();
  }

  function initViews() 
  {
    initFactionViews();
    mapView.show();
  }

  function initFactionViews() 
  {
    for (var factionName in gameView.players) {
      var FactionView = getFactionViewConstructor(factionName);
      var factionView = new FactionView();
      factionView.loadImages();
      factionViews[factionName] = factionView;
    }
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


  this.setFactions = function (factionsArray) {
    for (var i = 0; i < factionsArray.length; i++) {
      var factionName = factionsArray[i];
      var player = gameView.game.selectPlayer(factionName);
      gameView.players[factionName] = player;
    }
  }


  this.nextPlayerSetupTurn = function() {
    var nextFaction = turnOrder.shift();

    if (! nextFaction) {
      //this.nextGameTurn = function() { this.nextPlayerTurn() }
      this.nextGameTurn = nextGameTurn;
      return
    }

    var factionView = factionViews[nextFaction.constructor.name];

    factionView.startSetupTurn();
  }  

  function nextGameTurn() 
  {
    console.log('next game turn');
    roundView.start();
  }

  this.nextPlayerTurn = function() {
    console.log('start regular turn');

    if (! turnOrder.length) {
      console.log('refreshing turn order');
      turnOrder = gameView.game.getTurnOrder();
    }

    var nextFaction = turnOrder.shift();

    var factionView = factionViews[nextFaction.constructor.name];
    factionView.startTurn();
  }

}

},{"./CanvasContainer":2,"./Loader":14,"./View/Faction/Atreides":21,"./View/Faction/BeneGesserit":23,"./View/Faction/Emperor":24,"./View/Faction/Fremen":25,"./View/Faction/Guild":26,"./View/Faction/Harkonnen":27,"./View/FactionSelect":28,"./View/Game":29,"./View/Map":30,"./View/StartMenu":33,"Dune/View/Round":32}],4:[function(require,module,exports){
module.exports = new Debug();

function Debug() {
  //this.speed = 5;
  //this.timeout = 0;
}

},{}],5:[function(require,module,exports){
module.exports = new EventChain();

function EventChain() 
{
  var stack = new Array();

  this.add = function(list) 
  {
    if (list instanceof Array)
    {
      stack = stack.concat(list);
    } 
    else 
    {
      stack.push(list);
    }
  }

  this.next = function() 
  {
    if (! stack.length) return;

    var nextEvent = stack.shift();
    nextEvent();
  }

  this.removeLast = function() 
  {
    var lastEvent = stack.pop();
    return lastEvent;
  }
}

},{}],6:[function(require,module,exports){
module.exports = Atreides;

var internalDecorator = require("./Base.js");

function Atreides(game) { 

 var leaders = new Array(
    {"name": "Dr. Yueh", "strength": 1},
    {"name": "Duncan Idaho", "strength": 2},
    {"name": "Gurney Halleck", "strength": 4},
    {"name": "Thufir Hawat", "strength": 5},
    {"name": "Lady Jessica", "strength": 5}
  );

  internalDecorator(this, 
      {"spice": 10, "leaders": leaders, "name": "Atreides", "game": game});


}


},{"./Base.js":7}],7:[function(require,module,exports){
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

  setEachLeaderFaction();

  function setEachLeaderFaction() 
  {
    for (var i = 0; i < leaders.length; i++) {
      var leader = leaders[i];
      leader.faction = obj.constructor.name;
    }
  }

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

  obj.pickTraitor = function(newTraitor) {
    return traitor = newTraitor
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

},{}],8:[function(require,module,exports){
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

},{"./Base.js":7}],9:[function(require,module,exports){
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

},{"./Base.js":7}],10:[function(require,module,exports){
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


},{"./Base.js":7}],11:[function(require,module,exports){
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

},{"./Base.js":7}],12:[function(require,module,exports){
module.exports = Harkonnen;

var internalDecorator = require("./Base.js");
//HarkonnenFaction.prototype = new internalDecorator();
//HarkonnenFaction.prototype.constructor = HarkonnenFaction;

function Harkonnen(game) { 
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

},{"./Base.js":7}],13:[function(require,module,exports){
module.exports = Game;

var ArrakisMap = require("./Map");
var shuffleArray = require("./shuffle");

function Game() {

  var round = 0;

  var isStarted = false,
      factions = { },
      playerSeat = { },
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
    if (isStarted) 
      throw new Error("Unable to add more players. Game has already started");

    if (! factions[factionName]) {
      var FactionModule = getFactionModule(factionName);
      factions[factionName] = new FactionModule(this);
    }

    return factions[factionName];
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
    var playerSeatSectors = new Array(1, 4, 7, 10, 13,16);
    shuffleArray(playerSeatSectors);

    for (var name in factions) {
      var faction = factions[name];
      faction.seat = playerSeatSectors.shift();
    }
  }

  this.dealTraitorHand = function() {

    return traitorPool.splice(0,4);
  }

  this.dealTreacheryCard = function() {
  }

  this.stormRound = function () {
    var stormMovement = this.map.moveStorm();
    return stormMovement;
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
    var tempSector = this.map.stormSector - 0.5

    var aSortFirst = -1;
    var bSortFirst = 1;
    return turnOrder.sort(function sortCounterClockwiseAheadOfStorm(a,b) { 

      var tempAngle = convertSectorNumberToMapAngle(tempSector);
      var angleA = convertSectorNumberToMapAngle(a.seat);
      var angleB = convertSectorNumberToMapAngle(b.seat);

      if (tempAngle > angleA && tempAngle < angleB)
      	return aSortFirst;

      if (tempAngle < angleA && tempAngle > angleB)
      	return bSortFirst;

      var distanceToA = tempAngle - angleA;
      var distanceToB = tempAngle - angleB;

      if (distanceToA < distanceToB) 
      	return aSortFirst;

      if (distanceToA > distanceToB)
      	return bSortFirst;

      throw new Error("Player seats are equal. This shouldn't happen")

    });
  }

  convertSectorNumberToMapAngle = function(sectorNumber) {
    var degreesPerSector = 20;
    
    /* Dividing by 2 puts the angle in the center of the sector */
    var degrees = (sectorNumber * degreesPerSector) + degreesPerSector/2; 
    var radians = degrees * (Math.PI/180);
    return degrees;
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


},{"./Faction/Atreides":6,"./Faction/BeneGesserit":8,"./Faction/Emperor":9,"./Faction/Fremen":10,"./Faction/Guild":11,"./Faction/Harkonnen":12,"./Map":15,"./shuffle":37}],14:[function(require,module,exports){
var debug = require("Dune/Debug");
module.exports = Loader;

Image.prototype.moveToCoord = function(point) {
  var image = this;

  if (debug.speed) image.speed = debug.speed;

  if (arguments.length > 1) {
    throw new Error("Coordinate must be a single argument")
    return;
  }

  if (!image.canvas) {
    throw new Error("Image has no canvas property");
    return;
  }

  if (!image.canvas.redraw) {
    throw new Error("Image canvas has no redraw property");
    return;
  }

  if (!image.speed) {
    throw new Error("Image has no speed property");
    return;
  }

  if (image.xPos === undefined || image.yPos === undefined) {
    throw new Error("Image has no [x/y]Pos property");
    return;
  }


  var finalX = point[0],
      finalY = point[1];

  image.xStep = (finalX - image.xPos) * image.speed;
  image.yStep = (finalY - image.yPos) * image.speed;

  image.movement = setInterval(function () {
    image.animateMovement([finalX, finalY]);
  }, 10);

}

Image.prototype.animateMovement = function(point) {
  var image = this;

  var canvas = image.canvas;
  var context = canvas.getContext("2d");

  var x = point[0];
  var y = point[1];

  image.xPos += image.xStep;
  image.yPos += image.yStep;

  canvas.redraw();
  context.drawImage(image, 
    image.xPos, image.yPos,
    image.width, image.height
  );


  if (
    image.yStep > 0 && image.yPos + image.yStep >= y ||
    image.yStep < 0 && image.yPos + image.yStep <= y || 
    image.xStep > 0 && image.xPos + image.xStep >= x ||
    image.xStep < 0 && image.xPos + image.xStep <= x
  )
  {
    clearInterval(image.movement);
    delete image.movement;
    delete image.xStep;
    delete image.yStep;

    image.xPos = x
    image.yPos = y

    canvas.redraw();
    context.drawImage(image, 
      image.xPos, image.yPos,
      image.width, image.height
    );

    if (this.onHalt) {
      var onHalt = this.onHalt;
      delete this.onHalt;
      onHalt();
    }

  }
}

function Loader() {

    var isLoaded = true,
        assetsLoaded = 0, 
        assetsToLoad = 0, 
        loadingScreen = document.getElementById('loadingscreen'),
	loadingMessage = document.getElementById('loadingmessage');

    var that = this;
    
    this.loadImage = function(url) {
      assetsToLoad++;
      this.isLoaded = false;

      var loadingScreen = document.getElementById('loadingscreen');
      loadingScreen.style.display = "block";

      var image = new Image();

      image.src = url;
      image.xPos = 0;
      image.yPos = 0;
      image.speed = 0.01;
      image.onload = this.itemLoaded;

      return image;
    };

    this.itemLoaded = function () {
      assetsLoaded++;

      loadingMessage.innerHTML = 
	'isLoaded '+assetsLoaded+' of '+assetsToLoad;

      if (assetsLoaded == assetsToLoad){
	this.isLoaded = true;

	hideLoadingScreen();

	//and call the object onload method if it exists
	if(that.onload){
	    that.onload();
	    that.onload = undefined;
	}
      }
    }

    function hideLoadingScreen() {
      loadingScreen.style.display = "none";
    }
}

},{"Dune/Debug":4}],15:[function(require,module,exports){
module.exports = ArrakisMap;

var shuffleArray = require("./shuffle");

function ArrakisMap() {
  var cache = {};
  var conflicts = [];
  var stormDeck = [];

  /* Quadrants start at top of map and number 0 to 17 counterclockwise */
  var stormSector;
  var quadrants = 17;


  this.initStormPosition = function() {
    return stormSector = this.stormSector = Math.floor((Math.random()*quadrants)+0);
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
    return stormMovement;

    /* Storm moves counterclockwise */
/*    stormSector += stormMovement;*/

    //[> Reset storm quandrant position when it goes below 0 <]
    //if (stormSector > 17)
      //stormSector -= quadrants;

    /*return stormSector;*/
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

},{"./shuffle":37}],16:[function(require,module,exports){
module.exports = BaseView;

function BaseView(obj, props) {

  obj.imagePath = "/img/";
  obj.iconPath = obj.imagePath + "icons/";
  var view = props.view;

  obj.show = function() { view.style.display = "block" }
  obj.hide = function() { view.style.display = "none" }

}

},{}],17:[function(require,module,exports){
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");
var eventChain = require("Dune/EventChain");
var debug = require("Dune/Debug");

module.exports = DeckViewDecorator;

function DeckViewDecorator(obj, args) {

  var getCardImage = args.getCardImage;
  var deckImages = args.deckImages;

  var canvas, context;

  var mapDimensions = mapView.circle;

  var cardScaleWidth = 333,
      cardScaleHeight = 483;

  var xMapCenter = mapDimensions.centerX - cardScaleWidth/2;
  var yMapCenter = mapDimensions.centerY - cardScaleHeight/2;

  obj.dealCard = function(cardName) 
  {
    canvas = canvasContainer.layer("notification");
    var cardImage = getCardImage(cardName);
    setCardImageProperties(cardImage);

    moveDealtCardCardFromOffscreenRightToCenter(cardImage);
    pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(cardImage);

    return cardImage;
  }

  setCardImageProperties = function(cardImg) {
    var xPos = mapDimensions.centerX - cardScaleWidth/2;
    var yPos = mapDimensions.centerY - cardScaleHeight/2;

    canvas = canvasContainer.layer("notification");
    cardImg.canvas = canvas;
    cardImg.xPos = canvas.width;
    cardImg.yPos = yPos;
    cardImg.speed = 0.02;
    cardImg.width = cardScaleWidth;
    cardImg.height = cardScaleHeight;

    return cardImg;
  }

  function moveDealtCardCardFromOffscreenRightToCenter(cardImg) {
    context = canvas.getContext("2d");

    canvas.redraw = function() { 
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
    cardImg.moveToCoord([xMapCenter, yMapCenter]);
  }

  function pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(cardImg) {
    cardImg.onHalt = function() {
      var timeout = 1000;

      if (debug.timeout !== undefined) timeout = debug.timeout;

      setTimeout(function() { 

	var xPos = 0 - cardScaleWidth;
	var yPos = yMapCenter;

	cardImg.moveToCoord([xPos, yPos]);

	cardImg.onHalt = function() {
	  canvasContainer.deleteLayer(canvas);
	  eventChain.next();
	}
      }, timeout);
    }
  }

}

},{"Dune/CanvasContainer":2,"Dune/Debug":4,"Dune/EventChain":5,"Dune/View/Map":30}],18:[function(require,module,exports){
var Loader = require("Dune/Loader");
var mapView = require("Dune/View/Map");
var DeckViewDecorator = require("Dune/View/Deck/Base");

module.exports = new BonusDeckView();

function BonusDeckView() 
{
  var bonusDeckImages = new Array(
    "carryalls", "harvesters", "ornithopters", "smugglers"
  );

  loadImages();

  var args = {"getCardImage": getBonusCardImage}; 
  DeckViewDecorator(this, args);

  function loadImages() 
  {
    var loader = new Loader();

    for (var i = 0; i < bonusDeckImages.length; i++) {
      var bonusDeckImage = bonusDeckImages[i];
      var bonusImgUrl = "/img/bonus/" + bonusDeckImage + ".png";
      bonusDeckImages[bonusDeckImage] = loader.loadImage(bonusImgUrl);
    }
  }

  function getBonusCardImage(cardName) {
    if (!bonusDeckImages[cardName]) 
      throw new Error("No bonus card named " + cardName);

    var bonusCardImg = bonusDeckImages[cardName];
    return bonusCardImg;
  }

}

},{"Dune/Loader":14,"Dune/View/Deck/Base":17,"Dune/View/Map":30}],19:[function(require,module,exports){
var Loader = require("Dune/Loader");
var DeckViewDecorator = require("Dune/View/Deck/Base");
var gameView = require("Dune/View/Game");

module.exports = new StormDeckView();

function StormDeckView() {

  var stormCardImages = new Array(
    "1sector", "2sector", "3sector", "4sector", "5sector", "6sector"
  );

  loadImages();

  var args = {"getCardImage": getStormCardImage}; 
  DeckViewDecorator(this, args);

  function loadImages() {
    var loader = new Loader();

    for (var i = 0; i < stormCardImages.length; i++) 
    {
      var stormCardImage = stormCardImages[i];
      var stormImgUrl = "/img/storm/" + stormCardImage + ".png";
      stormCardImages[stormCardImage] = loader.loadImage(stormImgUrl);
    }

  }

  function getStormCardImage() 
  {
    var stormMovement = gameView.game.stormRound();
    var stormCardImage = stormCardImages[stormMovement + 'sector'];
    stormCardImage.stormMovement = stormMovement;
    return stormCardImage;
  }

}

},{"Dune/Loader":14,"Dune/View/Deck/Base":17,"Dune/View/Game":29}],20:[function(require,module,exports){
var Loader = require("Dune/Loader");
var shuffleArray = require("Dune/shuffle");
var DeckViewDecorator = require("Dune/View/Deck/Base");

module.exports = new TreacheryDeckView();

function TreacheryDeckView() 
{

  var treacheryDeckImages = new Array(
    "baliset", "chaumas", "chaumurky", "chrysknife", "cheapheroine", 
    "ellacadrug", "familyatomics", "gomjabbar", "hajr", 
    "harvester", "jubbacloak", "kulon", "lalala", "lasgun", 
    "maulapistol", "sliptip", "stunner", "thumper", "tleilaxughola", 
    "triptogamont", "weathercontrol"
  );

  addDuplicateCardsToTreacheryDeck();
  loadImages();

  var args = {"getCardImage": getNewTreacheryImage, "deckImages": [], 
    "deckPathUrl": "img/treachery/"}; 

  DeckViewDecorator(this, args);

  function addDuplicateCardsToTreacheryDeck() {
    var duplicateCards = new Array(
      Array.apply(null, new Array(4)).map(function() { return "shield" }),
      Array.apply(null, new Array(4)).map(function() { return "snooper" }),
      Array.apply(null, new Array(2)).map(function() { return "cheaphero" }),
      Array.apply(null, new Array(2)).map(function() { return "karama" })
    );

    for (var i = 0; i < duplicateCards.length; i++) {
      var duplicateCardArray = duplicateCards[i];
      treacheryDeckImages = treacheryDeckImages.concat(duplicateCardArray);
    }
  }

  function loadImages() {
    var loader = new Loader();

    for (var i = 0; i < treacheryDeckImages.length; i++) {
      var treacheryDeckImage = treacheryDeckImages[i];
      var treacheryImgUrl = "/img/treachery/" + treacheryDeckImage + ".png";
      treacheryDeckImages[i] = loader.loadImage(treacheryImgUrl);
    }

    loader.onload = function() {
      shuffleArray(treacheryDeckImages);
    }
  }



  function getNewTreacheryImage() {
    var treacheryImg = treacheryDeckImages.shift();
    return treacheryImg;
  }
}

},{"Dune/Loader":14,"Dune/View/Deck/Base":17,"Dune/shuffle":37}],21:[function(require,module,exports){
module.exports = AtreidesView;

var FactionDecorator = require("./Base");
var controller = require("../../Controller");
var gameView = require("Dune/View/Game");
var eventChain = require("Dune/EventChain");
var canvasContainer = require("Dune/CanvasContainer");
var bonusDeckView = require("Dune/View/Deck/Bonus.js");

function AtreidesView() {


  var images = {
    "troop": "atreides.png",
    "leaderPath": "/img/leaders/atreides/",
    "leaders": [ "dr._yueh.png", "duncan_idaho.png", "gurney_halleck.png", 
      "lady_jessica.png", "thufir_hawat.png" ],
    "emblem": "atreides-53x53.png"
  }

  var args = {
    "faction": gameView.players['Atreides'],
    "images": images
  };

  FactionDecorator(this, args);

  var playerScreen = args.playerScreen;

  var obj = this;

  this.shipInitialTroops = function() 
  { 
    var startingTerritory = "arrakeen";

    for (var i = 0; i < 9; i++) {
      eventChain.add(function () {
	playerScreen.shipTroops(startingTerritory);
      });
    }

    playerScreen.shipTroops(startingTerritory);

    eventChain.add(function() { 
      var notificationCanvas = canvasContainer.layer("notification");
      canvasContainer.deleteLayer(notificationCanvas);
      eventChain.next();
    });

    eventChain.add([
      function() { 
      	var card = bonusDeckView.dealCard("ornithopters") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) },
      function() { 
      	var card = bonusDeckView.dealCard("harvesters") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) },
      function() { 
      	var card = bonusDeckView.dealCard("carryalls") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) }

    ]);

  }

}

},{"../../Controller":3,"./Base":22,"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/View/Deck/Bonus.js":18,"Dune/View/Game":29}],22:[function(require,module,exports){
module.exports = BaseFactionView;

var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var eventChain = require("Dune/EventChain");

var ViewDecorator = require("../Base");

var treacheryDeckView = require("../Deck/Treachery.js");
var bonusDeckView = require("../Deck/Bonus.js");
var PlayerScreen = require("../PlayerScreen");
var mapView = require("Dune/View/Map");

var TraitorSelect = require("../TraitorSelect.js");

function BaseFactionView(obj, args) {

  ViewDecorator(obj, { "view": undefined });

  var faction = args.faction,
      images = args.images;

  var traitorSelect = args.traitorSelect || new TraitorSelect();

  //TODO figure out an elegant way to squash this public variable
  obj.faction = faction;

  var playerScreen = new PlayerScreen(args);
  args.playerScreen = playerScreen;

  var factionEmblemImg, 
      factionShieldImg;

  var dealtCard;

  obj.loadImages = function() {

    var loader = new Loader();

    var factionEmblemImgUrl = obj.imagePath + "emblems/" + images.emblem;
    factionEmblemImg = loader.loadImage(factionEmblemImgUrl)

    for (var i = 0; i < images.leaders.length; i++) {
      var leaderImgUrl = images.leaderPath + images.leaders[i];
      images.leaders[i] = loader.loadImage(leaderImgUrl);
    }


    loader.onload = function() {
      obj.drawPlayerSeat();
    };

  }

  obj.startSetupTurn = function() 
  {
    obj.startTurn();
    obj.setupEventChain();
  }

  obj.startTurn = function() 
  {
    playerScreen.hide();
    obj.promptUserStartTurn();
    eventChain.add(function () { playerScreen.show(); eventChain.next() });
  }


  obj.setupEventChain = function() {
    eventChain.add([
      function() { obj.promptUserSelectTraitor() },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { obj.drawTreacheryCard() },
      function() { playerScreen.addTreacheryCard(obj.dealtCard()) },
      function() { obj.shipInitialTroops() }
    ]);
  }

  obj.promptUserStartTurn = function() {


    var loader = new Loader();

    var factionName = faction.constructor.name.toLowerCase() 
    var factionShieldUrl = obj.imagePath + "shields/" + factionName + ".png";
    factionShieldImg = loader.loadImage(factionShieldUrl);

    loader.onload = drawUserPromptNotification;
  }

  function dismissUserPromptNotification(canvas) 
  {
    canvasContainer.deleteLayer(canvas);
    eventChain.next();
  }

  function drawUserPromptNotification() {
    var canvas = canvasContainer.layer("notification");
    canvas.addEventListener("mousedown", function(e) {
      dismissUserPromptNotification(this);
    });
    canvas.redraw = dimScreen;

    factionShieldImg.xPos = 0;
    factionShieldImg.yPos = 0;
    factionShieldImg.canvas = canvas;
    factionShieldImg.width = 768;
    factionShieldImg.height = 352;
    factionShieldImg.speed = 0.02;

    factionShieldImg.yPos = -factionShieldImg.height;

    factionShieldImg.moveToCoord([0,250]);
  }


  function dimScreen() 
  {
    var canvas = this;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(20, 20, 20, 0.6)";
    context.fillRect (0,0,canvas.width,canvas.height);
  }

  obj.getLeaders = function() { return faction.getLeaders() }

  obj.promptUserSelectTraitor = function() { traitorSelect.promptUser(obj) }

  obj.drawPlayerSeat = function() 
  {
    var canvas = canvasContainer.layer('playerseat');
    var context = canvas.getContext("2d");

    var circle = mapView.circle;
    circle.angle = mapView.convertSectorNumberToMapAngle(faction.seat);

    var iconOffset = factionEmblemImg.width/2;

    var coordinates = 
      mapView.calculateSectorEdgeFromMapAngle([iconOffset, iconOffset]);

    var x = coordinates[0] - iconOffset;
    var y = coordinates[1] - iconOffset;

    context.drawImage(factionEmblemImg, x, y);
  }


  obj.drawTreacheryCard = function()
  {
    var card = treacheryDeckView.dealCard();
    obj.takeCard(card);
  }

  obj.takeCard = function(cardImage) { dealtCard = cardImage }
  obj.dealtCard = function() { return dealtCard }

}

},{"../Base":16,"../Deck/Bonus.js":18,"../Deck/Treachery.js":20,"../PlayerScreen":31,"../TraitorSelect.js":36,"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/Loader":14,"Dune/View/Map":30}],23:[function(require,module,exports){

},{}],24:[function(require,module,exports){
module.exports=require(23)
},{}],25:[function(require,module,exports){
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

},{"./Base":22,"Dune/Game":13}],26:[function(require,module,exports){
module.exports=require(23)
},{}],27:[function(require,module,exports){
module.exports = HarkonnenView;

var FactionDecorator = require("./Base");
var gameView = require("Dune/View/Game");
var eventChain = require("Dune/EventChain");
var TraitorSelect = require("../TraitorSelect.js");
var canvasContainer = require("Dune/CanvasContainer");
var bonusDeckView = require("Dune/View/Deck/Bonus.js");

function HarkonnenView() {


  var traitorImages;
  var traitorSelect = new TraitorSelect();

  traitorSelect.selectTraitor = function(canvas, element) {
    traitorImages = canvas.elements;

    traitorSelect.selectTraitorImage(traitorImages.shift());
  }

  var images = {
    "troop": "harkonnen.png",
    "leaderPath": "/img/leaders/harkonnen/",
    "leaders": [ "beast_rabban.png", "captain_iakin_nefud.png", "feyd_rautha.png", 
      "piter_de_vries.png", "umman_kudu.png" ],
    "emblem": "harkonnen-53x53.png"
  };

  var args = {
    "faction": gameView.players['Harkonnen'],
    "traitorSelect": traitorSelect,
    "images": images
  };

  FactionDecorator(this, args);

  var playerScreen = args.playerScreen;

  var obj = this;

  this.setupEventChain = function() {
    eventChain.add([
      function() { obj.promptUserSelectTraitor() },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { traitorSelect.selectTraitorImage(traitorImages.shift()) },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { traitorSelect.selectTraitorImage(traitorImages.shift()) },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { traitorSelect.selectTraitorImage(traitorImages.shift()) },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { obj.drawTreacheryCard() },
      function() { playerScreen.addTreacheryCard(obj.dealtCard()) },
      function() { obj.drawTreacheryCard() },
      function() { playerScreen.addTreacheryCard(obj.dealtCard()) },
      function() { obj.shipInitialTroops() }
    ]);
  }

  this.shipInitialTroops = function() 
  { 
    var startingTerritory = "carthag";

    for (var i = 0; i < 9; i++) {
      eventChain.add(function () {
	playerScreen.shipTroops(startingTerritory);
      });
    }

    playerScreen.shipTroops(startingTerritory);

    eventChain.add(function() { 
      var notificationCanvas = canvasContainer.layer("notification");
      canvasContainer.deleteLayer(notificationCanvas);
      eventChain.next();
    });

    eventChain.add([
      function() { 
      	var card = bonusDeckView.dealCard("ornithopters") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) },
      function() { 
      	var card = bonusDeckView.dealCard("harvesters") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) },
      function() { 
      	var card = bonusDeckView.dealCard("carryalls") 
	obj.takeCard(card);
      },
      function() { playerScreen.addBonusCard(obj.dealtCard()) }

    ]);

  }

}

},{"../TraitorSelect.js":36,"./Base":22,"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/View/Deck/Bonus.js":18,"Dune/View/Game":29}],28:[function(require,module,exports){
module.exports = FactionSelectView;

var ViewDecorator = require("./Base");
//var MapView = require("./Map");
var controller = require("Dune/Controller");

function FactionSelectView() {

  ViewDecorator(this, { 
    "view": document.getElementById("factionselectscreen")
  });

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


  var that = this;

  init();

  function init() {
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
      image.src = that.iconPath + factionSelectIcon;
      image.onclick = factionSelector;

      container.appendChild(image);
      factionImages.push(image);
    }
  }

  function makeBackButtonElement() {
    var backButton = new Image();
    backButton.src = that.iconPath + "back.png";
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
    startButton.src = that.iconPath + "start.png";
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
    controller.setFactions(factions);
    controller.startGame();
  }

  function disableStartButton() {
    startButton.style.opacity = 0.6;
    startButton.style.cursor = "default";
    startButton.onclick = null; 
  }

}


},{"./Base":16,"Dune/Controller":3}],29:[function(require,module,exports){
var DuneGame = require("Dune/Game");

module.exports = new GameView();

function GameView() 
{
  this.game = new DuneGame();
  this.players = {};
}

},{"Dune/Game":13}],30:[function(require,module,exports){

var ViewDecorator = require("./Base");
var gameView = require("Dune/View/Game");
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var eventChain = require("Dune/EventChain");

module.exports = new MapView();

function MapView() {

  ViewDecorator(this, { 
    "view": document.getElementById("mapscreen") 
  });

  var canvas = canvasContainer.layer("storm");

  this.element = document.getElementById("mapscreen");

  var context = canvas.getContext("2d");

  var circle = {centerX:385, centerY:425, radius:338, angle: 0}
  this.circle = circle;

  this.stormSector = gameView.game.map.initStormPosition();

  var that = this;

  var stormImage;

  loadImages();

  function loadImages() {

    var loader = new Loader();

    var stormImageUrl = "img/icons/storm-marker.png";
    stormImage = loader.loadImage(stormImageUrl);

    loader.onload = function() {
      setStormImageDimensions();
      drawStormSetup();
    }

  }

  function setStormImageDimensions() 
  {
    stormImage.xPos = 0; 
    stormImage.yPos = 0; 
    stormImage.speed = .01; 
    stormImage.radius = 25;
  }

  function drawStormSetup() {

    var img = stormImage;

    var w = img.width;
    var h = img.height;

    var x = -w/2;
    var y = -h/2;

    circle.angle = that.convertSectorNumberToMapAngle(that.stormSector);

    var coordinates = that.calculateSectorEdgeFromMapAngle();
    coordinates[0] += x, coordinates[1] += y;

    context.save();
    context.translate(coordinates[0],coordinates[1]);
    context.translate(img.width/2, img.height/2);

    var TO_RADIANS = Math.PI/180;
    var degreesPerSector = 20;
    var degrees = (that.stormSector - 3) * degreesPerSector;

    context.rotate(degrees * TO_RADIANS);
    context.drawImage(img, -img.width/2, -img.height/2);
    context.restore();

  }

  this.moveStormNumberOfSectors = function(sectors) {
    var img = stormImage;

    var degreesPerSector = 20;
    var movementDegrees = sectors * degreesPerSector;
    var movementRadians = movementDegrees * Math.PI / 180;

    //DEBUG: I think other function are messing with the circle angle
    //TODO Need to move circle into its own module so functions that
    //need the calculations can get a fresh copy
    circle.angle = that.convertSectorNumberToMapAngle(that.stormSector);

    var stopAngle = circle.angle - movementRadians;
    animateStormSectorMovement(img, stopAngle);

  }

  function animateStormSectorMovement(img, stopAngle) {
    var interval = setInterval(function() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      var x = -img.width/2;
      var y = -img.height/2;

      var coordinates = that.calculateSectorEdgeFromMapAngle();
      coordinates[0] += x, coordinates[1] += y;


      circle.angle -= img.speed;

      if (circle.angle <= stopAngle) {
	clearInterval(interval);
	eventChain.next();
      }

      context.save();
      context.translate(coordinates[0],coordinates[1]);
      context.translate(img.width/2, img.height/2);

      var TO_RADIANS = Math.PI/180;


      /* Correct for the storm marker being skewed at an odd angle */
      var stormMarkerAngle = 291 * Math.PI/180;
      var rotation = circle.angle + stormMarkerAngle;
      context.rotate(rotation);

      context.drawImage(img, -img.width/2, -img.height/2);
      context.restore();

    }, 33);
  }

  this.convertSectorNumberToMapAngle = function(sectorNumber) {
    var degreesPerSector = 20;
    
    /* Dividing by 2 puts the angle in the center of the sector */
    var degrees = (sectorNumber * degreesPerSector) + degreesPerSector/2; 
    var radians = degrees * (Math.PI/180);
    return radians;
  }

  this.calculateSectorEdgeFromMapAngle = function(offset) {
    var offsetX = 0, offsetY = 0;
    if (offset) 
      offsetX = offset[0], offsetY = offset[1];

    return new Array(
      circle.centerX + Math.cos(circle.angle) * (circle.radius + offsetX),
      circle.centerY + Math.sin(circle.angle) * (circle.radius + offsetY)
    );
  }

}



},{"./Base":16,"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/Loader":14,"Dune/View/Game":29}],31:[function(require,module,exports){
module.exports = PlayerScreen;

var controller = require("Dune/Controller");

var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");
var eventChain = require("Dune/EventChain");

var territoryView = require("Dune/View/Territory");

function PlayerScreen(args) 
{
  var images = args.images;

  var layerName = "playerscreen";

  var canvas = canvasContainer.layer(layerName),
      context = canvas.getContext("2d"),
      loader = new Loader();


  canvas.height = 172;

  var deckImgPath = "/img/deck/";

  var spiceIconImg,
      troopIconImg,
      treacheryDeckImg,
      traitorDeckImg,
      bonusDeckImg,
      allianceDeckImg;


  var troopReserveCount = 20;

  var treacheryHand = [], traitorHand = [], bonusHand = [], allianceHand = [];

  var deckScaleWidth = 100;
  var deckScaleHeight = 145;

  var padding = 10;

  var transparent = 0.5;
  var solid = 1;

  var that = this;

  loadImages();

  function loadImages() {
    loadSpiceIcon();
    loadTroopIcon();
    loadPlayerHandImages();
    loader.onload = setImageProperties;
  }

  function loadSpiceIcon() 
  {
    var spiceIconImgUrl = "/img/icons/" + "spice-alt.png";
    spiceIconImg = loader.loadImage(spiceIconImgUrl);
  }

  function loadTroopIcon() 
  {
    var troopIconImgUrl = "/img/icons/troops/" + images.troop;
    troopIconImg = loader.loadImage(troopIconImgUrl);
  }

  function setImageProperties() 
  {
    troopIconImg.yPos = padding;
    setIconDimensions(troopIconImg);
    troopIconImg.faction = args.faction;

    spiceIconImg.yPos = troopIconImg.yPos + troopIconImg.width + padding;
    setIconDimensions(spiceIconImg);

    setTreacheryIconProperties();
    setTraitorIconProperties();
    setBonusIconProperties();
    setAllianceIconProperties();

    //allianceDeckImg.xPos = bonusDeckImg.xPos + deckScaleWidth + padding;
    //setCardDimensions(allianceDeckImg);
  }

  function setTreacheryIconProperties() {
    treacheryDeckImg.xPos = spiceIconImg.xPos + spiceIconImg.width + padding;
    setCardDimensions(treacheryDeckImg);

    treacheryDeckImg.triggerClickEvent = 
      function() { showPlayerHand(treacheryHand) }
  }

  function setTraitorIconProperties() {
    traitorDeckImg.xPos = treacheryDeckImg.xPos + deckScaleWidth + padding;
    setCardDimensions(traitorDeckImg);
    traitorDeckImg.triggerClickEvent = 
      function() { showPlayerHand(traitorHand) }
  }

  function setBonusIconProperties() {
    bonusDeckImg.xPos = traitorDeckImg.xPos + deckScaleWidth + padding;
    setCardDimensions(bonusDeckImg);
    bonusDeckImg.triggerClickEvent = 
      function() { showPlayerHand(bonusHand) }
  }

  function setAllianceIconProperties() {
    allianceDeckImg.xPos = bonusDeckImg.xPos + deckScaleWidth + padding;
    setCardDimensions(allianceDeckImg);
    allianceDeckImg.triggerClickEvent = 
      function() { showPlayerHand(allianceHand) }
  }

  function showPlayerHand(playerHand) {
    if (! playerHand.length) return;

    var notificationCanvas = canvasContainer.layer("notification");

    var cardScaleFactor = deckScaleHeight / deckScaleWidth;

    var mapHeight = notificationCanvas.height - canvas.height;

    var combinedCardPadding = padding * 4;
    var usableHeight = mapHeight - combinedCardPadding;
    var maxCardHeight = usableHeight/4;
    var maxCardWidth = deckScaleWidth * cardScaleFactor;


    for (var i = 0; i < playerHand.length; i++) {
      var cardImg = playerHand[i];

      var notificationContext = notificationCanvas.getContext("2d");
      //horizontal layout
      //var xPos = (i * (deckScaleWidth + padding) ) + padding;
      //var yPos = notificationCanvas.height - canvas.height - deckScaleHeight 
	//- padding; 

      // vertical layout
      var xPos = padding;

      var yPos =  mapHeight - maxCardHeight 
	- padding - (i * (maxCardHeight + padding)); 

      notificationContext.drawImage(cardImg, xPos, yPos
	  //,deckScaleWidth, deckScaleHeight);
	  ,maxCardWidth, maxCardHeight);
    }

    notificationCanvas.addEventListener('click', function(e) {
      canvasContainer.deleteLayer(notificationCanvas);
    });
  }

  function setIconDimensions(iconImg) 
  {
    var iconScaleSide = 67.5;
    iconImg.width = iconImg.height = iconScaleSide;
    iconImg.xPos = padding;
  }

  function setCardDimensions(cardImg) 
  {
    cardImg.yPos = padding
    cardImg.width = deckScaleWidth;
    cardImg.height = deckScaleHeight;
  }

  this.show = function() 
  {
    canvas.redraw = drawPlayerScreen;
    canvas.redraw();
    addClickEvent();
  }

  function addClickEvent() 
  {
    //TODO refactor player screen or canvas so that it doesn't get multiple
    //onclick events
    if (! canvas.isInteractive) {
      canvas.isInteractive = true;
      canvas.addEventListener('click', function(element) {
	var coord = getMousePosition(canvas,element);

	var icons = new Array(
	  spiceIconImg,
	  troopIconImg,
	  treacheryDeckImg,
	  traitorDeckImg,
	  bonusDeckImg,
	  allianceDeckImg
	);

	for (var i = 0; i < icons.length; i++) {
	  var image = icons[i];

	  if (coord.x >= image.xPos && coord.x <= image.xPos + image.width
	      && coord.y >= image.yPos && coord.y <= image.yPos + image.height
	      && image.triggerClickEvent
	  ) {
	    image.triggerClickEvent();
	    return;
	  }

	}

	controller.nextGameTurn();
      });
    }
  }

  this.hide = function() {
    drawBackground();
  }

  function drawPlayerScreen()
  {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    drawOffPlanetTroopReserves();

    context.drawImage(spiceIconImg, 
	spiceIconImg.xPos, spiceIconImg.yPos, 
	spiceIconImg.width, spiceIconImg.height);

    context.globalAlpha = transparent;

    drawPlayerHandImage(treacheryDeckImg, treacheryHand);
    drawPlayerHandImage(traitorDeckImg, traitorHand);
    drawPlayerHandImage(bonusDeckImg, bonusHand);
    drawPlayerHandImage(allianceDeckImg, allianceHand);

    context.globalAlpha = solid;

    drawLeaderDiscs();

    drawEndTurnButton();
  }

  function drawBackground() {
    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawOffPlanetTroopReserves() {

    context.drawImage(troopIconImg, 
      troopIconImg.xPos, troopIconImg.yPos, 
      troopIconImg.width, troopIconImg.height);

    drawTroopReserveCount();
  }

  function drawTroopReserveCount() {
    var fontSize = 12;
    context.font = fontSize + "pt Arial";
    
    var textWidth = context.measureText(troopReserveCount).width;

    /* Troop count displays at bottom-middle of troop token */
    var xPos = troopIconImg.xPos + troopIconImg.width/2 - textWidth/2;
    //var yPos = troopIconImg.yPos + iconScaleHeight - fontSize/2;
    var yPos = troopIconImg.yPos + troopIconImg.height - fontSize/2;

    context.strokeStyle = "black";
    context.lineWidth = 8;
    context.strokeText(troopReserveCount, xPos, yPos);

    context.fillStyle = "white";
    context.fillText(troopReserveCount, xPos, yPos);
  }

  function drawPlayerHandImage(image, playerHand) 
  {

    if (playerHand.length) {
      context.globalAlpha = solid;
    } else {
      context.globalAlpha = transparent;
    }

    context.drawImage(image, 
      image.xPos, image.yPos, 
      deckScaleWidth, deckScaleHeight);

    if (playerHand.length)
      drawHandCount(image, playerHand);


  }

  function drawLeaderDiscs() 
  {
    var leaderDiscs = images.leaders;

    var leaderCircle = {
      "centerX": 600,
      "centerY": canvas.height/2,
      "radius": 75,
      "angle": 0
    };

    var TO_RADIANS = Math.PI/180;
    var numberOfDiscs = 5;
    var centralAngle = 180/numberOfDiscs * TO_RADIANS;

    /* Calculate largest radius for 5 smaller circles that can fit in larger 
    * circle using steiner chain formula */
    var leaderDiscRadius = 
      leaderCircle.radius / ( (1 - Math.sin(centralAngle)) 
      / Math.sin(centralAngle) + 2 );

    for (var i = 0; i < numberOfDiscs; i++) {

      var degrees = 360 / numberOfDiscs;
      /* centralAngle arranges discs in star formation */
      leaderCircle.angle = (i * degrees * TO_RADIANS) - centralAngle/2;

      var x = leaderCircle.centerX + Math.cos(leaderCircle.angle) 
	* (leaderCircle.radius - leaderDiscRadius);
      var y = leaderCircle.centerY + Math.sin(leaderCircle.angle) 
	* (leaderCircle.radius - leaderDiscRadius);
      
      var leaderDiscImg = leaderDiscs[i];
      leaderDiscImg.xPos = x - leaderDiscRadius;
      leaderDiscImg.yPos = y - leaderDiscRadius;

      leaderDiscImg.width = leaderDiscImg.height = 2 * leaderDiscRadius;
      context.drawImage(leaderDiscImg, 
	leaderDiscImg.xPos, leaderDiscImg.yPos, 
	leaderDiscImg.width, leaderDiscImg.height);
    }
  }

  function drawEndTurnButton() {
    var text = "End Turn";

    var fontSize = 12;
    context.font = fontSize + "pt Arial";

    var textWidth = context.measureText(text).width;
    var xPos = canvas.width - textWidth;
    var yPos = canvas.height - fontSize;
    context.fillstyle = "black";
    context.fillText(text, xPos, yPos);

  }

  function loadPlayerHandImages()
  {
    loadTreacheryHand();
    loadTraitorHand();
    loadBonusHand();
    loadAllianceHand();
  }

  function loadTreacheryHand() 
  {
    var treacheryDeckImgUrl = deckImgPath + "treachery.png";
    treacheryDeckImg = loader.loadImage(treacheryDeckImgUrl);
  }

  function loadTraitorHand()
  {
    var traitorDeckImgUrl = deckImgPath + "traitor.png";
    traitorDeckImg = loader.loadImage(traitorDeckImgUrl);
   }

  function loadBonusHand()
  {
    var bonusDeckImgUrl = deckImgPath + "bonus.png";
    bonusDeckImg = loader.loadImage(bonusDeckImgUrl);
    }

  function loadAllianceHand()
  {
    var allianceDeckImgUrl = deckImgPath + "alliance.png";
    allianceDeckImg = loader.loadImage(allianceDeckImgUrl);
  }


  this.addTraitorCard = function(traitorCardImg) 
  {
    addCardToHand(traitorCardImg, traitorDeckImg);
    addCardOnHaltEvent(traitorCardImg, traitorHand);
  }

  this.addTreacheryCard = function(treacheryCardImg) 
  {
    addCardToHand(treacheryCardImg, treacheryDeckImg);
    addCardOnHaltEvent(treacheryCardImg, treacheryHand);
  }

  this.addBonusCard = function(bonusCardImg) 
  {
    addCardToHand(bonusCardImg, bonusDeckImg);
    addCardOnHaltEvent(bonusCardImg, bonusHand);
  }

  function addCardToHand(cardImg, playerHandImg)
  {
    cardImg.canvas = canvas;
    cardImg.xPos = canvas.width;
    cardImg.yPos = playerHandImg.yPos;
    cardImg.speed = 0.02;
    cardImg.width = deckScaleWidth;
    cardImg.height = deckScaleHeight;

    cardImg.moveToCoord([playerHandImg.xPos, playerHandImg.yPos]);
  }

  function addCardOnHaltEvent(cardImg, cardHand) {
    cardImg.onHalt = function() { 
      cardHand.push(cardImg);
      canvas.redraw() 
      eventChain.next();
    }
  }

  function drawHandCount(playerHandImg, playerHand)
  {

    var handCount = playerHand.length;
    var fontSize = 25;
    context.font = fontSize + "pt Arial";

    var textWidth = context.measureText(handCount).width;
    var textPadding = 1.3

    var xPos = playerHandImg.xPos + deckScaleWidth - textWidth * textPadding;
    var yPos = playerHandImg.yPos + fontSize * textPadding;

    context.fillStyle = "white";
    context.fillText(handCount, xPos, yPos);

    if (that.onHandUpdate) {
      that.onHandUpdate();
      delete that.onHandUpdate;
    }

  }

  this.shipTroops = function(territoryName) 
  {
    var territoryObj = territoryView.getTerritory(territoryName);

    var troopTokenImg = getTroopTokenImg(territoryObj);

    troopReserveCount--;
    canvas.redraw();
    territoryObj.addFaction(troopTokenImg);
  }

  function getTroopTokenImg(territoryObj) 
  {
    var notificationCanvas = canvasContainer.layer("notification");
    notificationCanvas.redraw = function() 
    {
      var context = this.getContext("2d");
      context.clearRect(0, 0, this.width, this.height);
      territoryObj.draw();
    }

    var troopTokenImg = new Image();

    if (! troopIconImg.faction) 
      throw new Error ('Troop image has no faction property');

    troopTokenImg.src = troopIconImg.src;
    troopTokenImg.faction = troopIconImg.faction;
    troopTokenImg.yPos = troopIconImg.yPos + notificationCanvas.height - canvas.height;
    troopTokenImg.xPos = troopIconImg.xPos;
    troopTokenImg.height = troopTokenImg.width = troopIconImg.width;
    troopTokenImg.canvas = notificationCanvas;
    troopTokenImg.speed = 0.1;

    return troopTokenImg;
  }
}

function getMousePosition(canvasElement,e)
{
  var rect = canvasElement.getBoundingClientRect();
  var mousex = e.clientX - rect.left; 
  var mousey = e.clientY - rect.top;

  return {x: mousex, y: mousey};
}


},{"Dune/CanvasContainer":2,"Dune/Controller":3,"Dune/EventChain":5,"Dune/Loader":14,"Dune/View/Territory":34}],32:[function(require,module,exports){
var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");
var eventChain = require("Dune/EventChain");
var stormDeckView = require("Dune/View/Deck/Storm");
var mapView = require("Dune/View/Map");

module.exports = new RoundView();

/*"storm", "spiceBlow", "bidding", "revival", "movement", "battle", */
/*"collection", "control"*/
function RoundView() 
{

  var canvas = canvasContainer.layer('roundscreen');
  var context = canvas.getContext("2d");
  var timeout = 2000;
  var stormMovement;

  var roundMarkers = {
    "storm": {"x": 174}, 
    "spiceblow": {"x": 221}, 
    "bidding": {"x": 269}, 
    "movement": {"x": 457},
    "battle": {"x": 504},
    "collection": {"x": 552}
  };

  loadRoundMarkerImages();

  function loadRoundMarkerImages() 
  {
    var loader = new Loader();

    for (var m in roundMarkers) {
      var url = "/img/rounds/" + m + ".png";
      roundMarkers[m].img = loader.loadImage(url);
    }

    loader.onload = setRoundMarkerDimensions;
  }

  function setRoundMarkerDimensions() 
  {
    var markerScale = 43;
    var yPos = 21;

    for (var marker in roundMarkers) {
      var props = roundMarkers[marker];
      var img = props.img;
      img.xPos = props.x;
      img.yPos = yPos;
      img.width = img.height = markerScale;
    }
  }

  this.start = function() {
    eventChain.add([
      function() { storm() },
      function() { mapView.moveStormNumberOfSectors(stormMovement) },
      function() { spiceBlow() },
      function() { bidding() },
      function() { revival() },
      function() { movement() },
      function() { battle() },
      function() { collection() }
    ]);
    eventChain.next();
  }

  function storm() 
  {
    drawMarkerImage("storm");
    var stormCardImg = stormDeckView.dealCard();
    stormMovement = stormCardImg.stormMovement;
  }

  function spiceBlow() 
  {
    console.log('spice blow round');
    drawMarkerImage("spiceblow");
    setTimeout(eventChain.next, timeout);
  }

  function bidding() 
  {
    console.log('bidding round');
    drawMarkerImage("bidding");
    setTimeout(eventChain.next, timeout);
  }

  function revival() 
  {
    console.log('revival round');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(eventChain.next, timeout);
  }

  function movement() 
  {
    console.log('movement round');
    drawMarkerImage("movement");
    setTimeout(eventChain.next, timeout);
  }

  function battle() 
  {
    console.log('battle round');
    drawMarkerImage("battle");
    setTimeout(eventChain.next, timeout);
  }

  function collection() 
  {
    console.log('collection round');
    drawMarkerImage("collection");
    setTimeout(eventChain.next, timeout);
  }

  function drawMarkerImage(markerName) 
  {
    var img = roundMarkers[markerName].img;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img,
      img.xPos, img.yPos,
      img.width, img.height);
  }

}

},{"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/Loader":14,"Dune/View/Deck/Storm":19,"Dune/View/Map":30}],33:[function(require,module,exports){
module.exports = StartMenuView;

var ViewDecorator = require('./Base');
var controller = require("Dune/Controller");

function StartMenuView() {

  ViewDecorator(this, { 
    "view": document.getElementById("gamestartscreen")
  });


  addPlayClickEvent();

  function addPlayClickEvent() {
    var playButton = document.getElementById("playbutton");
    playButton.onclick = showFactionSelectView;
  }

  function showFactionSelectView() {
    controller.hideStartMenuView();
    controller.showFactionSelectView();
  }

}


},{"./Base":16,"Dune/Controller":3}],34:[function(require,module,exports){
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");

//var polarSink = require("Dune/View/Territory/PolarSink");
var BaseTerritoryView = require("Dune/View/Territory/Base");

module.exports = new TerritoryView()

function TerritoryView() 
{
  var loader = new Loader();

  var territoryImages = {
    "carthag": new BaseTerritoryView("carthag"),
    "arrakeen": new BaseTerritoryView("arrakeen"),
    "falseWallEast": new BaseTerritoryView("falseWallEast"),
    "polarSink": new BaseTerritoryView("polarSink")
  };

  var that = this;

  addClickEventToImageMap();

  function addClickEventToImageMap() 
  {
    var areaTags = document.getElementsByTagName("area");

    for (var i = 0; i < areaTags.length; i++) {
      var areaTag = areaTags[i];
      areaTag.addEventListener('click', function(e) {
      	var territoryName = this.target;
	that.enlargeTerritory(this);
      });
    }
  }
  
  this.getTerritory = function(territoryName) {
    var territoryObj = territoryImages[territoryName];

    if (! territoryObj) 
      throw new Error("No territory " + territoryName);


    return territoryObj;

  }

  this.enlargeTerritory = function(areaTag) 
  {
    var territoryName = areaTag.target;
    var territoryObj = territoryImages[territoryName];

    if (! territoryObj) 
      throw new Error("No territory " + territoryName);

    territoryObj.enlarge(areaTag);

    return territoryObj;
  }

}

},{"Dune/CanvasContainer":2,"Dune/Loader":14,"Dune/View/Map":30,"Dune/View/Territory/Base":35}],35:[function(require,module,exports){
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");
var shuffleArray = require("Dune/shuffle");
var eventChain = require("Dune/EventChain");

module.exports = BaseTerritoryView;

function BaseTerritoryView(territoryImgName) {

  var loader = new Loader();

  var occupyingFactions = {};

  var circle = mapView.circle;

  var troopIconSize = 8.5;

  var smallCoords = getMapOverviewTerritoryCoordinates();

  var imageUrl = "/img/territories/" + territoryImgName + ".png";
  var image = loader.loadImage(imageUrl);

  loader.onload = function() {
    setImageDimensions();
  }

  function getMapOverviewTerritoryCoordinates() {
    var areaTags = document.getElementsByTagName("area");

    for (var i = 0; i < areaTags.length; i++) {
      var areaTag = areaTags[i];

      if (areaTag.target == "polarSink") {
	var coords = areaTag.coords.split(',');
	return coords;
      }
    }
  }

  function calculateImageScaleFactor() 
  {
    var largestTerritorySide = Math.max(image.width, image.height);
    var imageScaleFactor = 2 * circle.radius / largestTerritorySide;
    return imageScaleFactor;
  }

  function setImageDimensions() {
    var imageScaleFactor = calculateImageScaleFactor();

    image.width *= imageScaleFactor;
    image.height *= imageScaleFactor;
    image.xPos = circle.centerX - image.width/2; 
    image.yPos = circle.centerY - image.height/2;
  }


  this.addFaction = function(troopTokenImg) {

    var faction = troopTokenImg.faction.constructor.name;

    if (occupyingFactions[faction]) {
      occupyingFactions[faction].troops.unshift(troopTokenImg);

    } else {

      occupyingFactions[faction] = {
	"troops": [troopTokenImg]
      };


      var TO_RADIANS = Math.PI/180;

      var troopCircle = {
	"centerX": image.xPos + image.width/2,
	"centerY": image.yPos + image.height/2,
	"radius": 125,
	"angle": 0
      };


      var maxDiscs = 8;
      var maxAngle = 180/maxDiscs * TO_RADIANS;

      var maxTroopRadius = 
	troopCircle.radius / ( (1 - Math.sin(maxAngle)) 
	/ Math.sin(maxAngle) + 2 );

      troopIconSize = maxTroopRadius * 2;

      var numberOfDiscs = Object.keys(occupyingFactions).length
      var centralAngle = 180/numberOfDiscs * TO_RADIANS;

      var steinerCircleRadius = 
	troopCircle.radius / ( (1 - Math.sin(centralAngle)) 
	/ Math.sin(centralAngle) + 2 );

      var innerCircleRadius = steinerCircleRadius * (1/Math.sin(centralAngle) - 1);
      
      var degrees = 360 / numberOfDiscs;
      var distanceFromCenter = 0;
      if (numberOfDiscs != 1)
	//distanceFromCenter = maxTroopRadius + innerCircleRadius;
	distanceFromCenter = troopCircle.radius - maxTroopRadius;

      var i = 0;
      for (var f in occupyingFactions) { 
      	i++;

	troopCircle.angle = (i * degrees * TO_RADIANS); 

	// Rotate the angle for odd disc numbers to keep things symmetrical
	if (numberOfDiscs % 2) troopCircle.angle -= centralAngle/2;



	var x = troopCircle.centerX + Math.cos(troopCircle.angle) 
	  * distanceFromCenter;
	var y = troopCircle.centerY + Math.sin(troopCircle.angle) 
	  * distanceFromCenter;
	
	x -= maxTroopRadius;
	y -= maxTroopRadius;

	occupyingFactions[f].coords = {"x": x, "y": y};

	if (f != faction) {
	  console.log('setting new coords for '+faction);
	  troopTokenImg.xPos = x;
	  troopTokenImg.yPos = y;
	}

	troopTokenImg.width = maxTroopRadius * 2;
	troopTokenImg.height = maxTroopRadius * 2;
      }

    }

    var troopCoords = occupyingFactions[faction].coords
    troopTokenImg.moveToCoord([troopCoords.x, troopCoords.y]);
    troopTokenImg.onHalt = eventChain.next;
  }

  this.enlarge = function() {
    addCanvasClickEvent();
    drawTerritoryImage();
  }

  this.draw = function() {
    drawTerritoryImage();
  }

  function addCanvasClickEvent() {
    var canvas = canvasContainer.layer("notification");
    canvas.addEventListener('click', function(e) {
      canvasContainer.deleteLayer(canvas);
    });
  }

  function drawTerritoryImage() {

    var canvas = canvasContainer.layer("notification");
    context = canvas.getContext("2d");


    context.drawImage(image, 
      image.xPos, image.yPos,
      image.width, image.height
    );

/*    context.strokeStyle = "red";*/
    //context.lineWidth = 5;
    /*context.strokeRect(image.xPos, image.yPos, image.width, image.height);*/

    drawOccupyingFactions();
  }

  function drawOccupyingFactions() {
    for (var factionName in occupyingFactions) {
      var faction = occupyingFactions[factionName];
      var troops = faction.troops;
      var troopIcon = troops[0];
      var troopCoords = faction.coords;

/*      console.log(factionName);*/
      //console.log('troopIcon:');
      //console.dir(troopIcon.xPos + ', ' + troopIcon.yPos);
      //console.log('troopCoords:');
      /*console.dir(troopCoords.x + ', ' + troopCoords.y);*/

     context.drawImage(troopIcon, 
	troopCoords.x, troopCoords.y
	//troopIcon.xPos, troopIcon.yPos
	//,troopIconSize, troopIconSize
	,troopIcon.width, troopIcon.height
      );
      //context.drawImage(troopIcon, 
	//troopIcon.xPos, troopIcon.yPos,
	//troopIcon.width, troopIcon.height
      //);

      var troopCount = troops.length;

      var fontSize = 10;
      
      var textWidth = context.measureText(troopCount).width;

      var xPos = troopCoords.x + troopIconSize/2 - textWidth/2;
      var yPos = troopCoords.y + troopIconSize - fontSize/2;

      context.strokeStyle = "black";
      context.lineWidth = 5;
      context.strokeText(troopCount, xPos, yPos);

      context.fillStyle = "white";
      context.fillText(troopCount, xPos, yPos);
    }

    //var troopCircle = {
      //"centerX": image.xPos + image.width/2,
      //"centerY": image.yPos + image.height/2,
      //"radius": 125,
      //"angle": 0
    //};
    //context.beginPath();
    //context.arc(troopCircle.centerX, troopCircle.centerY, troopCircle.radius,
	//0, 2 * Math.PI);
    //context.stroke();

  }


}

},{"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/Loader":14,"Dune/View/Map":30,"Dune/shuffle":37}],36:[function(require,module,exports){
//module.exports = promptUserSelectTraitor;
module.exports = TraitorSelect;

var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");
var eventChain = require("Dune/EventChain");

var canvas, context, canvasContainer;

var traitorScaleWidth = 275,
    traitorScaleHeight = 400;


var factionView;

function TraitorSelect() {
  
  this.promptUser = function(view) {

    factionView = view;

    canvas = canvasContainer.layer('notification');

    context = canvas.getContext("2d");

    var loader = new Loader();

    faction = factionView.faction;

    canvas.elements = new Array();

    var that = this;

    loadTraitorHandImages();
    addOnClickEvent();

    function loadTraitorHandImages() {
      var traitorHand = faction.drawTraitorHand();

      for (var i = 0; i < traitorHand.length; i++) {
	var traitor = traitorHand[i];
	var factionName = traitor.faction.toLowerCase().split(' ').join('');

	var imageUrl = "/img/traitors/" + factionName + "/" 
	  + traitor.name.toLowerCase().split(' ').join('_') + ".png";

	var image = loader.loadImage(imageUrl);
	image.traitor = traitor;
	canvas.elements[i] = image;
      }
    }

    function addOnClickEvent() {
      canvas.addEventListener('click', function(element) {
      	that.selectTraitor(this, element);

      });
    }


    loader.onload = drawTraitorSelectScreen;
  }

  this.selectTraitorImage = function(image)
  {
    factionView.takeCard(image);

    var traitorObj = image.traitor;
    var faction = factionView.faction;
    faction.pickTraitor(traitorObj);

    canvasContainer.deleteLayer(canvas);

    eventChain.next();
  }

}

TraitorSelect.prototype.selectTraitor = function(canvas, element) {
  var coord = getMousePosition(canvas,element);

  for (var i = 0; i < canvas.elements.length; i++) {
    var image = canvas.elements[i];

    if (coord.x >= image.xPos && coord.x <= image.xPos + traitorScaleWidth
	&& coord.y >= image.yPos && coord.y <= image.yPos + traitorScaleHeight
    ) {
      this.selectTraitorImage(image);
    }
  }
}

function getMousePosition(canvasElement,e)
{
  var rect = canvasElement.getBoundingClientRect();
  var mousex = e.clientX - rect.left; 
  var mousey = e.clientY - rect.top;

  return {x: mousex, y: mousey};
}



function drawTraitorSelectScreen() 
{
  var captionText = "Choose your traitor";
  drawCaption(captionText);
  drawTraitors();
}

function drawCaption(captionText) 
{
  var captionTextAttr = getCaptionTextAttr(captionText);
  var captionBorderDimensions = getCaptionBorderDimensions(captionTextAttr);

  drawCaptionBorder(captionBorderDimensions);
  drawCaptionText(captionTextAttr, captionBorderDimensions);
}

function getCaptionTextAttr(text) 
{
  var fontSize = 30;
  context.font = fontSize+"pt Arial";

  return {
    "text": text,
    "padding": 20,
    "fontSize": fontSize,
    "font": fontSize+"pt Arial",
    "width": context.measureText(text).width,
    "height": fontSize
  };

}

function getCaptionBorderDimensions(captionTextAttr) {
  return { 
    "buffer1": 8,
    "buffer2": 3.6,
    "width": captionTextAttr.width + captionTextAttr.padding,
    "height": captionTextAttr.fontSize * 2,
    "x": canvas.width/2 - captionTextAttr.width/2 - captionTextAttr.padding/2,
    "y": 20
  };
}

function drawCaptionBorder(border) {
  context.beginPath();

  drawCaptionBorderBottomRight(border);
  drawCaptionBorderBottomLeft(border);
  drawCaptionBorderTopLeft(border);
  drawCaptionBorderTopRight(border);

  context.closePath();

  var transparentBlackStyle = "rgba(20, 20, 20, 0.6)";
  context.fillStyle = transparentBlackStyle;
  context.fill();
  context.lineWidth = 2.0;
  context.strokeStyle = "rgb(255, 255, 255)";
  context.stroke();

}

function drawCaptionBorderBottomRight(border) 
{
  var borderWidth = border.x + border.width;
  var borderHeight = border.y + border.height;

  var startX = borderWidth;
  var startY = borderHeight - border.buffer1;

  var xMidpoint1 = startX;
  var yMidpoint1 = borderHeight - border.buffer2;

  var xMidpoint2 = borderWidth - border.buffer2; 
  var yMidpoint2 = borderHeight;

  var endX = borderWidth - border.buffer1;
  var endY = yMidpoint2;

  context.moveTo(startX, startY);
  context.lineTo(startX, startY);
  context.bezierCurveTo(
      xMidpoint1, yMidpoint1, 
      xMidpoint2, yMidpoint2, 
      endX, endY);
}

function drawCaptionBorderBottomLeft(border)
{
  var startX = border.x + border.buffer1;
  var startY = border.y + border.height;

  var xMidpoint1 = border.x + border.buffer2;
  var yMidpoint1 = startY;

  var xMidpoint2 = border.x;
  var yMidpoint2 = yMidpoint1;

  var endX = border.x;
  var endY = yMidpoint2 - border.buffer1;

  context.lineTo(startX, startY);
  context.bezierCurveTo(
    xMidpoint1, yMidpoint1,
    xMidpoint2, yMidpoint2,
    endX, endY);
}

function drawCaptionBorderTopLeft(border) 
{
  var startX = border.x;
  var startY = border.y + border.buffer1;

  var xMidpoint1 = startX;
  var yMidpoint1 = border.y + border.buffer2;

  var xMidpoint2 = border.x + border.buffer2;
  var yMidpoint2 = border.y;

  var endX = border.x + border.buffer1;
  var endY = border.y;

  context.lineTo(startX, startY);
  context.bezierCurveTo(
    xMidpoint1, yMidpoint1,
    xMidpoint2, yMidpoint2,
    endX, endY);
}

function drawCaptionBorderTopRight(border) 
{
  var startX = border.x + border.width - border.buffer1;
  var startY = border.y;

  var xMidpoint1 = border.x + border.width - border.buffer2;
  var yMidpoint1 = border.y;

  var xMidpoint2 = border.x + border.width;
  var yMidpoint2 = border.y + border.buffer2;

  var endX = xMidpoint2;
  var endY = border.y + border.buffer1;

  context.lineTo(startX, startY);
  context.bezierCurveTo(
    xMidpoint1, yMidpoint1,
    xMidpoint2, yMidpoint2,
    endX, endY);
}

function drawCaptionText(captionTextAttr, captionBorderDimensions) {

  var horizontalCenter = canvas.width/2;

  var xPos = horizontalCenter - captionTextAttr.width/2;
  var yPos = captionBorderDimensions.height + captionBorderDimensions.y/4;

  context.fillStyle = "white";
  context.fillText(captionTextAttr.text, xPos, yPos);
}

function drawTraitors()
{

  var image1 = canvas.elements[0];

  image1.xPos = 75;
  image1.yPos = 100;

  var image2 = canvas.elements[1];

  image2.xPos = canvas.width - traitorScaleWidth - image1.xPos;
  image2.yPos = image1.yPos;

  var image3 = canvas.elements[2];

  image3.xPos = image1.xPos;
  image3.yPos = image2.yPos + image2.xPos - traitorScaleWidth - image1.xPos + traitorScaleHeight ;

  var image4 = canvas.elements[3];

  image4.xPos = image2.xPos;
  image4.yPos = image3.yPos;

  context.drawImage(
      image1, image1.xPos, image1.yPos, traitorScaleWidth, traitorScaleHeight);

  context.drawImage(
      image2, image2.xPos, image2.yPos, traitorScaleWidth, traitorScaleHeight);

  context.drawImage(
      image3, image3.xPos, image3.yPos, traitorScaleWidth, traitorScaleHeight);

  context.drawImage(
      image4, image4.xPos, image4.yPos, traitorScaleWidth, traitorScaleHeight);
}

},{"Dune/CanvasContainer":2,"Dune/EventChain":5,"Dune/Loader":14}],37:[function(require,module,exports){
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