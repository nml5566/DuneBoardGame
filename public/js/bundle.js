(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var gameController = require("Dune/Controller");

window.onload = function() {
  

  //var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  drawSquaresOfTerritory();
}

function drawSquaresOfTerritory() 
{
/*  var canvasContainer = require("Dune/CanvasContainer");*/
  //var canvas = canvasContainer.layer("notification");
  /*var ctx = canvas.getContext("2d");*/
  var territoryView = require("Dune/View/Territory");

  //var territoryImage = territoryView.enlargeTerritory('carthag');
  //console.log(territoryImage);
  return;

  // polar sink
  //var coords=[374,484,368,476,361,466,350,466,341,462,332,454,327,454,321,446,324,425,333,408,348,397,366,395,379,391,384,387,391,387,397,394,409,394,413,392,425,392,436,405,434,425,424,439,418,452,411,461,410,473,395,484];

  //false wall east
  //var coords=[455,460,436,469,418,453,425,439,435,425,437,405,426,391,414,391,414,384,427,372,433,360,449,371,467,396,467,426,465,429,465,437];
  
  //rim wall west
  var coords=[484,269,483,267,485,264,484,253,522,187,527,187,532,182,536,183,536,197,530,204,527,219,516,237,516,243,510,243,510,248,500,254,500,259,487,268];

  var s = 8.5;

  var smallestX = undefined,
      largestX = undefined, 
      smallestY = undefined,
      largestY = undefined; 

  for( i=2 ; i < coords.length-1 ; i+=2 )
  {
    var x= coords[i], y = coords[i+1];

    if (smallestX == undefined) { smallestX = x }
    else if (x < smallestX) { smallestX = x }

    if (smallestY == undefined) { smallestY = y }
    else if (y < smallestY) { smallestY = y }

    if (largestX == undefined) { largestX = x }
    else if (x > largestX) { largestX = x }

    if (largestY == undefined) { largestY = y }
    else if (y > largestY) { largestY = y }
  }

  

  var width = largestX - smallestX;
  var height = largestY - smallestY;

  ctx.strokeRect(smallestX, smallestY,
      width, height);


  var squarePoints = [];
  var x = smallestX;
  var y = smallestY;
  while (x < largestX && y < largestY) {

    squarePoints.push({x: x, y: y});

    x += s;

    if (x > largestX) {
      x = smallestX;
      y += s;
    }

  }


  drawTerritoryOutline(coords, ctx);

  var territorySquares = [];
  for (var i = 0; i < squarePoints.length; i++) {
    var coords = squarePoints[i];

    var topLeft = {"x": coords.x, "y": coords.y};
    var topRight = {"x": coords.x + s, "y": coords.y};

    var bottomLeft = {"x": coords.x, "y": coords.y + s};
    var bottomRight = {"x": coords.x + s, "y": coords.y + s};

    if (
      ctx.isPointInPath(topLeft.x, topLeft.y) 
      && ctx.isPointInPath(topRight.x, topRight.y)
      && ctx.isPointInPath(bottomLeft.x, bottomLeft.y) 
      && ctx.isPointInPath(bottomRight.x, bottomRight.y)
    ) {
      territorySquares.push(topLeft);

      ctx.strokeStyle = "red";
      ctx.strokeRect(topLeft.x, topLeft.y,
	s, s);
    }

  }

  console.log('territorySquares');
  console.log(territorySquares.length);
}

function drawTerritoryOutline(coords, ctx) {

  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 ) {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

}


},{"Dune/Controller":3,"Dune/View/Territory":30}],2:[function(require,module,exports){
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
      case "test":
      	return 95;
      default:
      	throw new Error("No zIndex case defined for " + layerName);
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
    this.startPlayerTurn();
  }

  this.startPlayerTurn = function() { this.startPlayerSetupTurn() }

  function hideFactionSelectView()
  {
    var factionSelectView = new FactionSelectView();
    factionSelectView.hide();
  }

  function initViews() 
  {
    initFactionViews();
    initMapView();
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

  function initMapView() {
    mapView.show();
    mapView.loadImages();
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


  this.startPlayerSetupTurn = function() {
    var nextFaction = turnOrder.shift();

    if (! nextFaction) {
      turnOrder = gameView.game.getTurnOrder();
      this.startPlayerTurn = function() { this.startPlayerRegularTurn() }
      return;
    }

    var factionView = factionViews[nextFaction.constructor.name];

    factionView.startSetupTurn();
  }  

  this.startPlayerRegularTurn = function() {
    console.log('start regular turn');
    var nextFaction = turnOrder.shift();

    if (! nextFaction) {
      console.log('TODO add round management');
      return;
    }

    var factionView = factionViews[nextFaction.constructor.name];
    factionView.startTurn();
  }

}

},{"./CanvasContainer":2,"./Loader":13,"./View/Faction/Atreides":18,"./View/Faction/BeneGesserit":20,"./View/Faction/Emperor":21,"./View/Faction/Fremen":22,"./View/Faction/Guild":23,"./View/Faction/Harkonnen":24,"./View/FactionSelect":25,"./View/Game":26,"./View/Map":27,"./View/StartMenu":29}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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


},{"./Base.js":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./Base.js":6}],8:[function(require,module,exports){
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

},{"./Base.js":6}],9:[function(require,module,exports){
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


},{"./Base.js":6}],10:[function(require,module,exports){
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

},{"./Base.js":6}],11:[function(require,module,exports){
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

},{"./Base.js":6}],12:[function(require,module,exports){
module.exports = Game;

var ArrakisMap = require("./Map");
var shuffleArray = require("./shuffle");

function Game() {

  var round = 0;

  var isStarted = false,
      factions = { },
      playerSeat = { },
      //stormSector,
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
    //return stormSector = this.map.moveStorm();
    return this.map.moveStorm();
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


},{"./Faction/Atreides":5,"./Faction/BeneGesserit":7,"./Faction/Emperor":8,"./Faction/Fremen":9,"./Faction/Guild":10,"./Faction/Harkonnen":11,"./Map":14,"./shuffle":33}],13:[function(require,module,exports){
module.exports = Loader;

Image.prototype.moveToCoord = function(point) {
  var image = this;

  //DEBUG
  //image.speed = 5;

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

},{}],14:[function(require,module,exports){
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

    /* Storm moves counterclockwise */
    stormSector += stormMovement;

    /* Reset storm quandrant position when it goes below 0 */
    if (stormSector > 17)
      stormSector -= quadrants;

    return stormSector;
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

},{"./shuffle":33}],15:[function(require,module,exports){
module.exports = BaseView;

function BaseView(obj, props) {

  obj.imagePath = "/img/";
  obj.iconPath = obj.imagePath + "icons/";
  var view = props.view;

  obj.show = function() { view.style.display = "block" }
  obj.hide = function() { view.style.display = "none" }

}

},{}],16:[function(require,module,exports){
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");
var eventChain = require("Dune/EventChain");

module.exports = new BonusDeckView();

function BonusDeckView() 
{
  var canvas;

  var bonusDeckImages = new Array(
    "carryalls", "harvesters", "ornithopters", "smugglers"
  );

  var loader = new Loader();

  var cardScaleWidth = 333,
      cardScaleHeight = 483;

  var mapDimensions = mapView.circle;

  var xCenterScreen = mapDimensions.centerX - cardScaleWidth/2;
  var yCenterScreen = mapDimensions.centerY - cardScaleHeight/2;

  for (var i = 0; i < bonusDeckImages.length; i++) {
    var bonusDeckImage = bonusDeckImages[i];
    var bonusImgUrl = "/img/bonus/" + bonusDeckImage + ".png";
    bonusDeckImages[bonusDeckImage] = loader.loadImage(bonusImgUrl);
  }

  this.dealCard = function(cardName) 
  {
    canvas = canvasContainer.layer("notification");
    var bonusCard = getBonusCardImage(cardName);

    moveDealtCardCardFromOffscreenRightToCenter(bonusCard);
    pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(bonusCard);

    return bonusCard;

  }


  function moveDealtCardCardFromOffscreenRightToCenter(bonusCardImg) {
    context = canvas.getContext("2d");

    canvas.redraw = function() { 
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
    bonusCardImg.moveToCoord([xCenterScreen, yCenterScreen]);
  }

  function pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(bonusCardImg) {
    bonusCardImg.onHalt = function() {
      setTimeout(function() { 

	var xPos = 0 - cardScaleWidth;
	var yPos = yCenterScreen;

	bonusCardImg.moveToCoord([xPos, yPos]);

	bonusCardImg.onHalt = function() {
	  canvasContainer.deleteLayer(canvas);
	  eventChain.next();
	}
      }, 1000);
    }
  }

  function getBonusCardImage(cardName) {

    if (!bonusDeckImages[cardName]) 
      throw new Error("No bonus card named " + cardName);

    var bonusCardImg = bonusDeckImages[cardName];

    var xPos = mapDimensions.centerX - cardScaleWidth/2;
    var yPos = mapDimensions.centerY - cardScaleHeight/2;

    bonusCardImg.canvas = canvas;
    bonusCardImg.xPos = canvas.width;
    bonusCardImg.yPos = yPos;
    bonusCardImg.speed = 0.02;
    bonusCardImg.width = cardScaleWidth;
    bonusCardImg.height = cardScaleHeight;

    return bonusCardImg
  }

}

},{"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/Loader":13,"Dune/View/Map":27}],17:[function(require,module,exports){
var mapView = require("Dune/View/Map");
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var shuffleArray = require("Dune/shuffle");
var eventChain = require("Dune/EventChain");

module.exports = new TreacheryDeckView();

function TreacheryDeckView() 
{
  var canvas,context;

  var loader = new Loader();

  var cardScaleWidth = 333,
      cardScaleHeight = 483;

  var mapDimensions = mapView.circle;

  var xCenterScreen = mapDimensions.centerX - cardScaleWidth/2;
  var yCenterScreen = mapDimensions.centerY - cardScaleHeight/2;

  var treacheryDeckImages = new Array(
    "baliset", "chaumas", "chaumurky", "chrysknife", "cheapheroine", 
    "ellacadrug", "familyatomics", "gomjabbar", "hajr", 
    "harvester", "jubbacloak", "kulon", "lalala", "lasgun", 
    "maulapistol", "sliptip", "stunner", "thumper", "tleilaxughola", 
    "triptogamont", "weathercontrol"
  );

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

  for (var i = 0; i < treacheryDeckImages.length; i++) {
    var treacheryDeckImage = treacheryDeckImages[i];
    var treacheryImgUrl = "/img/treachery/" + treacheryDeckImage + ".png";
    treacheryDeckImages[i] = loader.loadImage(treacheryImgUrl);
  }

  loader.onload = function() {
    shuffleArray(treacheryDeckImages);
  }


  var that = this;

  this.dealCard = function() {

    canvas = canvasContainer.layer("notification");
    var treacheryImg = getNewTreacheryImage();

    moveDealtCardCardFromOffscreenRightToCenter(treacheryImg);
    pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(treacheryImg);

    return treacheryImg;
  }

  function moveDealtCardCardFromOffscreenRightToCenter(treacheryImg) {
    context = canvas.getContext("2d");

    canvas.redraw = function() { 
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
    treacheryImg.moveToCoord([xCenterScreen, yCenterScreen]);
  }

  function pauseBrieflyThenMoveDealtCardLeftUntilOffscreen(treacheryImg) {
    treacheryImg.onHalt = function() {
      setTimeout(function() { 

	var xPos = 0 - cardScaleWidth;
	var yPos = yCenterScreen;

	treacheryImg.moveToCoord([xPos, yPos]);

	treacheryImg.onHalt = function() {
	  canvasContainer.deleteLayer(canvas);
	  eventChain.next();
	}
      }, 1000);
    }
  }

  function getNewTreacheryImage() {
    var treacheryImg = treacheryDeckImages.shift();


    var xPos = mapDimensions.centerX - cardScaleWidth/2;
    var yPos = mapDimensions.centerY - cardScaleHeight/2;

    treacheryImg.canvas = canvas;
    treacheryImg.xPos = canvas.width;
    treacheryImg.yPos = yPos;
    treacheryImg.speed = 0.02;
    treacheryImg.width = cardScaleWidth;
    treacheryImg.height = cardScaleHeight;

    return treacheryImg
  }
}

},{"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/Loader":13,"Dune/View/Map":27,"Dune/shuffle":33}],18:[function(require,module,exports){
module.exports = AtreidesView;

var FactionDecorator = require("./Base");
var controller = require("../../Controller");
var gameView = require("Dune/View/Game");
var eventChain = require("Dune/EventChain");
var canvasContainer = require("Dune/CanvasContainer");
var bonusDeckView = require("Dune/View/Deck/Bonus.js");

function AtreidesView() {

  var priv = {};

  var images = {
    "troop": "atreides.png",
    "leaderPath": "/img/leaders/atreides/",
    "leaders": [ "dr._yueh.png", "duncan_idaho.png", "gurney_halleck.png", 
      "lady_jessica.png", "thufir_hawat.png" ],
    "emblem": "atreides-53x53.png"
  }

  FactionDecorator(this, {
    "faction": gameView.players['Atreides'],
    "private": priv,
    "images": images
  });

  var playerScreen = priv.playerScreen;

  var obj = this;

  this.shipInitialTroops = function() 
  { 
    for (var i = 0; i < 9; i++) {
      eventChain.add(function () {
	playerScreen.shipTroops("polarSink");
      });
    }

    playerScreen.shipTroops("polarSink");

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

},{"../../Controller":3,"./Base":19,"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/View/Deck/Bonus.js":16,"Dune/View/Game":26}],19:[function(require,module,exports){
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

  if (! args["private"])
    args["private"] = { };

  var faction = args.faction,
      images = args.images;

  var traitorSelect = args.traitorSelect || new TraitorSelect();

  //TODO figure out an elegant way to squash this public variable
  obj.faction = faction;

  var playerScreen = new PlayerScreen(images);
  args["private"].playerScreen = playerScreen;

  var factionEmblemImg, 
      factionShieldImg;

  var dealtCard;

  obj.loadImages = function() {

    var loader = new Loader();

    var factionEmblemImgUrl = obj.imagePath + "emblems/" + images.emblem;
    factionEmblemImg = loader.loadImage(factionEmblemImgUrl)

    var troopIconImgUrl = "/img/icons/troops/" + images.troop;
    images.troop = loader.loadImage(troopIconImgUrl);

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
    playerScreen.draw();
    //DEBUG
    //obj.promptUserStartTurn();
  }


  obj.setupEventChain = function() {
    eventChain.add([
      function() { 
      	obj.promptUserSelectTraitor() },
      function() { playerScreen.addTraitorCard(obj.dealtCard()) },
      function() { obj.drawTreacheryCard() },
      function() { playerScreen.addTreacheryCard(obj.dealtCard()) },
      function() { obj.shipInitialTroops() }
    ]);
  }

  obj.promptUserStartTurn = function() {

    canvas = canvasContainer.layer("notification");
    context = canvas.getContext("2d");

    //canvasContainer.moveLayerToTop(canvas);

    canvas.addEventListener("mousedown", function(e) {
      dismissUserPromptNotification();
    });

    var loader = new Loader();

    var factionShieldName = faction.constructor.name.toLowerCase() 
      + "-shield.png"
    var factionShieldUrl = obj.imagePath + factionShieldName;
    factionShieldImg = loader.loadImage(factionShieldUrl);
    factionShieldImg.speed = 0.01;

    loader.onload = drawUserPromptNotification;
  }

  function dismissUserPromptNotification() {
    canvasContainer.deleteLayer(canvas);

    eventChain.next();
  }

  function drawUserPromptNotification() {

    factionShieldImg.xPos = 0;
    factionShieldImg.yPos = 0;

    factionShieldImg.yPos = -factionShieldImg.height;

    moveImageToPoint(factionShieldImg, [0,250]);
  }

  function moveImageToPoint(image, point) {
    var finalX = point[0],
	finalY = point[1];

    image.xStep = (finalX - image.xPos) * image.speed;
    image.yStep = (finalY - image.yPos) * image.speed;

    image.movement = setInterval(function () {
      animateImageMovement(image, [finalX, finalY]);
    }, 10);

  }

  function animateImageMovement(image, point) {
    dimScreen(image);

    var x = point[0];
    var y = point[1];

    image.xPos += image.xStep;
    image.yPos += image.yStep;

    var shieldScaleWidth = 768;
    var shieldScaleHeight = 352;

    context.drawImage(image, 
      image.xPos, image.yPos,
      shieldScaleWidth, shieldScaleHeight
    );

    if (image.yPos + image.yStep >= y) {
      clearInterval(image.movement);
      delete image.movement;
      delete image.xStep;
      delete image.yStep;

      dimScreen(image);

      image.xPos = x
      image.yPos = y

      context.drawImage(image, 
	image.xPos, image.yPos,
	shieldScaleWidth, shieldScaleHeight
      );

      if (image.onhalt) {
	  image.onhalt();
	  image.onhalt = undefined;
      }

    }
  }

  function dimScreen(image) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(20, 20, 20, 0.6)";
    context.fillRect (0,0,canvas.width,canvas.height);
  }

  obj.getLeaders = function() {
    return faction.getLeaders();
  }

  obj.promptUserSelectTraitor = function() { 
    traitorSelect.promptUser(obj) 
  };

  obj.drawPlayerSeat = function() {

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

},{"../Base":15,"../Deck/Bonus.js":16,"../Deck/Treachery.js":17,"../PlayerScreen":28,"../TraitorSelect.js":32,"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/Loader":13,"Dune/View/Map":27}],20:[function(require,module,exports){

},{}],21:[function(require,module,exports){
module.exports=require(20)
},{}],22:[function(require,module,exports){
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

},{"./Base":19,"Dune/Game":12}],23:[function(require,module,exports){
module.exports=require(20)
},{}],24:[function(require,module,exports){
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

  var priv = {};

  var images = {
    "troop": "harkonnen.png",
    "leaderPath": "/img/leaders/harkonnen/",
    "leaders": [ "beast_rabban.png", "captain_iakin_nefud.png", "feyd_rautha.png", 
      "piter_de_vries.png", "umman_kudu.png" ],
    "emblem": "harkonnen-53x53.png"
  };

  FactionDecorator(this, {
    "faction": gameView.players['Harkonnen'],
    "private": priv,
    "traitorSelect": traitorSelect,
    "images": images
  });

  var playerScreen = priv.playerScreen;

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
    for (var i = 0; i < 9; i++) {
      eventChain.add(function () {
	playerScreen.shipTroops("polarSink");
      });
    }


    playerScreen.shipTroops("polarSink");

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

},{"../TraitorSelect.js":32,"./Base":19,"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/View/Deck/Bonus.js":16,"Dune/View/Game":26}],25:[function(require,module,exports){
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


},{"./Base":15,"Dune/Controller":3}],26:[function(require,module,exports){
var DuneGame = require("Dune/Game");

module.exports = new GameView();

function GameView() 
{
  this.game = new DuneGame();
  this.players = {};
}

},{"Dune/Game":12}],27:[function(require,module,exports){

var ViewDecorator = require("./Base");
var gameView = require("Dune/View/Game");
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");

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

  this.loadImages = function() {

    var loader = new Loader();

    var stormImageUrl = "img/icons/storm-marker.png";
    stormImage = loader.loadImage(stormImageUrl);

    loader.onload = drawStormSetup;

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

    //moveStormNumberOfSectors(img, 18);
  }

  function moveStormNumberOfSectors(img, sectors) {
    var degreesPerSector = 20;
    var movementDegrees = sectors * degreesPerSector;
    var movementRadians = movementDegrees * Math.PI / 180;

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

      if (circle.angle <= stopAngle) 
	clearInterval(interval);

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

  function moveImageToPoint(image, point) {
    var finalX = point[0],
	finalY = point[1];

    image.xStep = (finalX - image.xPos) * image.speed;
    image.yStep = (finalY - image.yPos) * image.speed;

    image.movement = setInterval(function () {
      animateImageMovement(image, [finalX, finalY]);
    }, 10);

  }

  function animateImageMovement(image, point) {
    clearImage(image);

    var x = point[0];
    var y = point[1];

    image.xPos += image.xStep;
    image.yPos += image.yStep;

    context.drawImage(image, image.xPos, image.yPos);

    if (image.yPos + image.yStep >= y) {
      clearInterval(image.movement);
      delete image.movement;
      delete image.xStep;
      delete image.yStep;

      clearImage(image);

      image.xPos = x
      image.yPos = y

      context.drawImage(image, image.xPos, image.yPos);

      if (image.onhalt) {
	  image.onhalt();
	  image.onhalt = undefined;
      }

    }
  }

  function clearImage(image) {
    context.clearRect(image.xPos, image.yPos,
      image.width, image.height);
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



},{"./Base":15,"Dune/CanvasContainer":2,"Dune/Loader":13,"Dune/View/Game":26}],28:[function(require,module,exports){
module.exports = PlayerScreen;

var controller = require("Dune/Controller");

var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");
var eventChain = require("Dune/EventChain");

var territoryView = require("Dune/View/Territory");

function PlayerScreen(images) 
{

  var canvas = canvasContainer.layer("playerscreen"),
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

  var traitorHand = [],
      treacheryHand = [],
      bonusHand = [],
      allianceHand = [];

  var iconScaleWidth = 67.5;
  var iconScaleHeight = 67.5;

  var deckScaleWidth = 100;
  var deckScaleHeight = 145;

  var padding = 10;

  var transparent = 0.5;
  var solid = 1;

  var that = this;

  this.draw = function() 
  {
    troopIconImg = images.troop;
    troopIconImg.xPos = padding;
    troopIconImg.yPos = padding;
    troopIconImg.width = iconScaleWidth;
    troopIconImg.height = iconScaleHeight;

    var spiceIconImgUrl = "/img/icons/" + "spice-alt.png";
    spiceIconImg = loader.loadImage(spiceIconImgUrl);
    spiceIconImg.xPos = padding;
    spiceIconImg.yPos = troopIconImg.yPos + iconScaleHeight + padding;
    spiceIconImg.width = iconScaleWidth;
    spiceIconImg.height = iconScaleWidth;

    loadPlayerHandImages();

    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.redraw = drawPlayerScreen;

    loader.onload = function() { canvas.redraw() }

    //TODO refactor player screen or canvas so that it doesn't get multiple
    //onclick events
    if (! canvas.onclick) {
      canvas.onclick = function(element) {
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
	  ) {
	    console.log('clicked:');
	    console.log(image);
	  }

	}

	controller.startPlayerTurn();
      };
    }
  }

  this.update = function() {
    //TODO merge with this.draw
    canvas.redraw();
  }

  function drawPlayerScreen()
  {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width, canvas.height);

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

  function drawOffPlanetTroopReserves() {

    context.drawImage(troopIconImg, 
      troopIconImg.xPos, troopIconImg.yPos, 
      troopIconImg.width, troopIconImg.height);
      //iconScaleWidth, iconScaleHeight);

    drawTroopReserveCount();
  }

  function drawTroopReserveCount() {
    var fontSize = 12;
    context.font = fontSize + "pt Arial";
    
    var textWidth = context.measureText(troopReserveCount).width;

    // dead center
    //var xPos = troopIconImg.xPos + iconScaleWidth/2 - textWidth/2;
    //var yPos = troopIconImg.yPos + iconScaleHeight/2 + fontSize/2; 

    // left-middle
    //var xPos = troopIconImg.xPos; 
    //var yPos = troopIconImg.yPos + iconScaleHeight/2 + fontSize/2; 
   
    // bottom-middle position
    var xPos = troopIconImg.xPos + iconScaleWidth/2 - textWidth/2;
    var yPos = troopIconImg.yPos + iconScaleHeight - fontSize/2;

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

    //var discScaleWidth = 50;
    //var discScaleHeight = 50;

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

      //discScaleWidth = discScaleHeight = 2 * leaderDiscRadius;
      leaderDiscImg.width = leaderDiscImg.height = 2 * leaderDiscRadius;
      context.drawImage(leaderDiscImg, 
	leaderDiscImg.xPos, leaderDiscImg.yPos, 
	leaderDiscImg.width, leaderDiscImg.height);
	//discScaleWidth, discScaleHeight);

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
    treacheryDeckImg.xPos = spiceIconImg.xPos + iconScaleWidth + padding;
    treacheryDeckImg.yPos = 10;
    treacheryDeckImg.width = deckScaleWidth;
    treacheryDeckImg.height = deckScaleHeight;
  }

  function loadTraitorHand()
  {
    var traitorDeckImgUrl = deckImgPath + "traitor.png";
    traitorDeckImg = loader.loadImage(traitorDeckImgUrl);
    traitorDeckImg.xPos = treacheryDeckImg.xPos + deckScaleWidth + padding;
    traitorDeckImg.yPos = padding;
    traitorDeckImg.width = deckScaleWidth;
    traitorDeckImg.height = deckScaleHeight;
  }

  function loadBonusHand()
  {
    var bonusDeckImgUrl = deckImgPath + "bonus.png";
    bonusDeckImg = loader.loadImage(bonusDeckImgUrl);
    bonusDeckImg.xPos = traitorDeckImg.xPos + deckScaleWidth + padding;
    bonusDeckImg.yPos = padding;
    bonusDeckImg.width = deckScaleWidth;
    bonusDeckImg.height = deckScaleHeight;
  }

  function loadAllianceHand()
  {
    var allianceDeckImgUrl = deckImgPath + "alliance.png";
    allianceDeckImg = loader.loadImage(allianceDeckImgUrl);
    allianceDeckImg.xPos = bonusDeckImg.xPos + deckScaleWidth + padding;
    allianceDeckImg.yPos = padding
    allianceDeckImg.width = deckScaleWidth;
    allianceDeckImg.height = deckScaleHeight;
  }


  function drawLeaderDiskStarFormation() 
  {
  }

  this.addTraitorCard = function(traitorCardImg) 
  {
    addCardToHand(traitorCardImg, traitorDeckImg);
    traitorCardImg.onHalt = function() { 
      traitorHand.push(traitorCardImg);
      canvas.redraw() 

      eventChain.next();
    }
  }

  this.addTreacheryCard = function(treacheryCardImg) 
  {
    addCardToHand(treacheryCardImg, treacheryDeckImg);
    treacheryCardImg.onHalt = function() { 
      treacheryHand.push(treacheryCardImg);
      canvas.redraw() 

      eventChain.next();
    }
  }

  this.addBonusCard = function(bonusCardImg) 
  {
    addCardToHand(bonusCardImg, bonusDeckImg);
    bonusCardImg.onHalt = function() { 
      bonusHand.push(bonusCardImg);
      canvas.redraw() 

      eventChain.next();
    }
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
    this.update();
    var troopObj = territoryObj.addFaction('atreides', troopTokenImg);

    var troopScale = troopObj.scale;
    troopTokenImg.width = troopScale;
    troopTokenImg.height = troopScale;

    var troopCoords = troopObj.coords;
    troopTokenImg.moveToCoord([troopCoords.x, troopCoords.y]);

    troopTokenImg.onHalt = eventChain.next;

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

    troopTokenImg.src = troopIconImg.src;
    troopTokenImg.yPos = troopIconImg.yPos + notificationCanvas.height - canvas.height;
    troopTokenImg.xPos = troopIconImg.xPos;
    troopTokenImg.height = iconScaleHeight;
    troopTokenImg.width = iconScaleWidth;
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


},{"Dune/CanvasContainer":2,"Dune/Controller":3,"Dune/EventChain":4,"Dune/Loader":13,"Dune/View/Territory":30}],29:[function(require,module,exports){
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


},{"./Base":15,"Dune/Controller":3}],30:[function(require,module,exports){
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");

var polarSink = require("Dune/View/Territory/PolarSink");
//var arrakeen = require("Dune/View/Territory/Arrakeen");
//var carthag = require("Dune/View/Territory/Carthag");

module.exports = new TerritoryView()

function TerritoryView() 
{
  var loader = new Loader();

  var territoryImages = {
    "carthag": "/img/territories/carthag.png",
    "arrakeen": "/img/territories/arrakeen.png",
    "polarSink": polarSink
  };

  var that = this;

  //loadTerritoryImages();
  addClickEventToImageMap();

  function addClickEventToImageMap() 
  {
    var areaTags = document.getElementsByTagName("area");

    for (var i = 0; i < areaTags.length; i++) {
      var areaTag = areaTags[i];
      areaTag.addEventListener('click', function(e) {
      //areaTag.attachEvent('onclick', function(e) {
      	console.log('clicked area');
      	var territoryName = this.target;

	console.log(territoryName);


	that.enlargeTerritory(this);
      });
      //};
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

  function drawSquaresOfTerritory(areaTag) 
  {
    // polar sink
    //var coords=[374,484,368,476,361,466,350,466,341,462,332,454,327,454,321,446,324,425,333,408,348,397,366,395,379,391,384,387,391,387,397,394,409,394,413,392,425,392,436,405,434,425,424,439,418,452,411,461,410,473,395,484];

    //false wall east
    //var coords=[455,460,436,469,418,453,425,439,435,425,437,405,426,391,414,391,414,384,427,372,433,360,449,371,467,396,467,426,465,429,465,437];
    
    //rim wall west
    //var coords=[484,269,483,267,485,264,484,253,522,187,527,187,532,182,536,183,536,197,530,204,527,219,516,237,516,243,510,243,510,248,500,254,500,259,487,268];
    console.log('area tag');
    console.log(areaTag.coords);

    var coords = areaTag.coords.split(',');

    var s = 8.5;

    var smallestX = undefined,
	largestX = undefined, 
	smallestY = undefined,
	largestY = undefined; 

    for( i=2 ; i < coords.length-1 ; i+=2 )
    {
      var x= coords[i], y = coords[i+1];

      if (smallestX == undefined) { smallestX = x }
      else if (x < smallestX) { smallestX = x }

      if (smallestY == undefined) { smallestY = y }
      else if (y < smallestY) { smallestY = y }

      if (largestX == undefined) { largestX = x }
      else if (x > largestX) { largestX = x }

      if (largestY == undefined) { largestY = y }
      else if (y > largestY) { largestY = y }
    }

    

    var width = largestX - smallestX;
    var height = largestY - smallestY;

    var canvas = canvasContainer.layer("notification");
    var ctx = canvas.getContext("2d");

    ctx.strokeRect(smallestX, smallestY,
	width, height);

    return;


    var squarePoints = [];
    var x = smallestX;
    var y = smallestY;
    while (x < largestX && y < largestY) {

      squarePoints.push({x: x, y: y});

      x += s;

      if (x > largestX) {
	x = smallestX;
	y += s;
      }

    }


    drawTerritoryOutline(coords, ctx);

    var territorySquares = [];
    for (var i = 0; i < squarePoints.length; i++) {
      var coords = squarePoints[i];

      var topLeft = {"x": coords.x, "y": coords.y};
      var topRight = {"x": coords.x + s, "y": coords.y};

      var bottomLeft = {"x": coords.x, "y": coords.y + s};
      var bottomRight = {"x": coords.x + s, "y": coords.y + s};

      if (
	ctx.isPointInPath(topLeft.x, topLeft.y) 
	&& ctx.isPointInPath(topRight.x, topRight.y)
	&& ctx.isPointInPath(bottomLeft.x, bottomLeft.y) 
	&& ctx.isPointInPath(bottomRight.x, bottomRight.y)
      ) {
	territorySquares.push(topLeft);

	ctx.strokeStyle = "red";
	ctx.strokeRect(topLeft.x, topLeft.y,
	  s, s);
      }

    }

    console.log('territorySquares');
    console.log(territorySquares.length);
  }

}




function drawTerritoryOutline(coords, ctx) 
{
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 )
  {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

}


},{"Dune/CanvasContainer":2,"Dune/Loader":13,"Dune/View/Map":27,"Dune/View/Territory/PolarSink":31}],31:[function(require,module,exports){
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");
var mapView = require("Dune/View/Map");
var shuffleArray = require("Dune/shuffle");

module.exports = new PolarSinkView();

function PolarSinkView() {

  var loader = new Loader();

  var occupyingFactions = {};
  var troopQuadrants;

  var circle = mapView.circle;

  var troopIconSize = 8.5;
  var imageScaleFactor, imageScaleWidth, imageScaleHeight;

  var imageUrl = "/img/territories/polarSink.png";
  var image = loader.loadImage(imageUrl);

  var smallCoords = getMapOverviewTerritoryCoordinates();
  var largeCoords = [];;

  loader.onload = function() {
    calculateImageScaleFactor();
    setImageCoordinates();
    troopQuadrants = calculateTroopQuadrants();
  }

  function calculateImageScaleFactor() 
  {
    var largestTerritorySide = Math.max(image.width, image.height);
    imageScaleFactor = 2 * circle.radius / largestTerritorySide;

    imageScaleWidth = image.width * imageScaleFactor;
    imageScaleHeight = image.height * imageScaleFactor;
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

  this.addFaction = function(faction, factionImage) {

    if (occupyingFactions[faction]) {
      occupyingFactions[faction].troops.push(factionImage);

    } else {
      shuffleArray(troopQuadrants);

      occupyingFactions[faction] = {
      	"coords": troopQuadrants.shift(),
      	"scale": troopIconSize,
	"troops": [factionImage]
      };
    }

    return occupyingFactions[faction];
  }

  this.enlarge = function() {
    addCanvasClickEvent();
    drawTerritoryImage(largeCoords);
  }

  this.draw = function() {
    drawTerritoryImage(largeCoords);

  }

  function addCanvasClickEvent() {
    var canvas = canvasContainer.layer("notification");
    canvas.addEventListener('click', function(e) {
      canvasContainer.deleteLayer(canvas);
    });
  }

  function drawTerritoryImage(largeCoords) {

    var canvas = canvasContainer.layer("notification");
    context = canvas.getContext("2d");


    context.drawImage(image, 
      image.xPos, image.yPos,
      image.width, image.height
    );

    context.strokeStyle = "red";
    context.lineWidth = 1;

    //DEBUG draw territory quadrants outline
 /*   for(var i=0 ; i < troopQuadrants.length-1 ; i++ ) {*/
      //var troopQuadrant = troopQuadrants[i];
      //context.strokeRect(
                //troopQuadrant.x, troopQuadrant.y,
                //troopIconSize, troopIconSize
      //);
    /*}*/

    //DEBUG draw placement circle outline
    drawTroopCircle();
  
    //DEBUG draw territory bounding box outline
    context.strokeRect(image.xPos, image.yPos, image.width, image.height);


    drawOccupyingFactions();
  }

  function drawTroopCircle() {
    var TO_RADIANS = Math.PI/180;

    var troopCircle = {
      "centerX": image.xPos + image.width/2,
      "centerY": image.yPos + image.height/2,
      "radius": 100,
      "angle": 0
    };

    context.beginPath();
    context.arc(troopCircle.centerX, troopCircle.centerY, 
    	troopCircle.radius, 0, 2 * Math.PI);
    context.stroke();

    var maxDiscs = 8;
    var maxAngle = 180/maxDiscs * TO_RADIANS;
    console.log(maxAngle);
    var maxTroopRadius = 
      troopCircle.radius / ( (1 - Math.sin(maxAngle)) 
      / Math.sin(maxAngle) + 2 );
    console.log('maxTroopRadius');
    console.log(maxTroopRadius);


    var numberOfDiscs = 8;
    var centralAngle = 180/numberOfDiscs * TO_RADIANS;

    var troopRadius = 
      troopCircle.radius / ( (1 - Math.sin(centralAngle)) 
      / Math.sin(centralAngle) + 2 );

    var innerCircleRadius = troopRadius * (1/Math.sin(centralAngle) - 1);
    //var innerCircleRadius = maxTroopRadius * (1/Math.sin(maxAngle) - 1);
    
    console.log('innerCircleRadius');
    console.log(innerCircleRadius);

/*    context.beginPath();*/
    //context.arc(troopCircle.centerX, troopCircle.centerY, 
            //innerCircleRadius, 0, 2 * Math.PI);
    //context.strokeStyle = "green";
    /*context.stroke();*/

    for (var i = 0; i < numberOfDiscs; i++) {
      var degrees = 360 / numberOfDiscs;

      troopCircle.angle = (i * degrees * TO_RADIANS); 

      // Rotate the angle for odd disc numbers to keep things symmetrical
      if (numberOfDiscs % 2) troopCircle.angle -= centralAngle/2;


      var distanceFromCenter = maxTroopRadius + innerCircleRadius;
      if (numberOfDiscs == 1) distanceFromCenter = 0;

      var x = troopCircle.centerX + Math.cos(troopCircle.angle) 
	* distanceFromCenter;
      var y = troopCircle.centerY + Math.sin(troopCircle.angle) 
	* distanceFromCenter;
      
      context.beginPath();
      //context.arc(x, y, troopRadius, 0, 2 * Math.PI);
      context.arc(x, y, maxTroopRadius, 0, 2 * Math.PI);
      context.strokeStyle = "red";
      context.stroke();
    }
  }

  function drawOccupyingFactions() {
    for (var factionName in occupyingFactions) {
      var faction = occupyingFactions[factionName];
      var troops = faction.troops;
      var troopIcon = troops[0];
      var troopCoords = faction.coords;

      context.drawImage(troopIcon, 
	troopCoords.x, troopCoords.y
	,troopIconSize, troopIconSize
      );

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
  }

  function setImageCoordinates() {
    image.xPos = circle.centerX - imageScaleWidth/2; 
    image.yPos = circle.centerY - imageScaleHeight/2;
  }

  function calculateTroopQuadrants() {

    var rectangle = getTerritoryMinimumBoundingRectangle(smallCoords);

    var smallestX = rectangle.x
    var smallestY = rectangle.y

    var width = rectangle.width;
    var height = rectangle.height;

    var canvas = canvasContainer.layer("test");
    var context = canvas.getContext("2d");

    var scale = scaleCoordinatesToEnlargedTerritory(smallCoords, rectangle);

    drawTerritoryOutline(largeCoords, context);

    var quadrants = divideBoundingRectangleIntoQuadrants(scale);

    var troopQuadrants = getQuadrantsInsideTerritoryBoundary(quadrants, context);

    return troopQuadrants;
  }

  function getTerritoryMinimumBoundingRectangle(coords) {

    var smallestX = undefined,
	largestX = undefined, 
	smallestY = undefined,
	largestY = undefined; 

    for( i=2 ; i < coords.length-1 ; i+=2 )
    {
      var x= coords[i], y = coords[i+1];

      if (smallestX == undefined) { smallestX = x }
      else if (x < smallestX) { smallestX = x }

      if (smallestY == undefined) { smallestY = y }
      else if (y < smallestY) { smallestY = y }

      if (largestX == undefined) { largestX = x }
      else if (x > largestX) { largestX = x }

      if (largestY == undefined) { largestY = y }
      else if (y > largestY) { largestY = y }
    }

    var width = largestX - smallestX;
    var height = largestY - smallestY;

    var rectangle = {"x": smallestX, "y": smallestY, 
      "width": width, "height": height};

    return rectangle;
  }

  function scaleCoordinatesToEnlargedTerritory(coords, rectangle) {

    var xShift = coords[0] - image.xPos; 
    var yShift = coords[1] - image.yPos;

    var scaleX = image.width / rectangle.width;
    var scaleY = image.height/ rectangle.height;
    var scale = Math.max(scaleX, scaleY);

    for( i=0 ; i < coords.length-1 ; i+=2 )
    {
      var xShift = (rectangle.x * scale - image.xPos);
      var yShift = (rectangle.y * scale - image.yPos);

      largeCoords[i] = coords[i] * scale;
      largeCoords[i+1] = coords[i+1] * scale;

      largeCoords[i] -= xShift;
      largeCoords[i+1] -= yShift;
    }

    return scale;
  }

  function divideBoundingRectangleIntoQuadrants(coordScale) {
    var quadrants = [];

    troopIconSize *= coordScale;

    smallestX = image.xPos;
    smallestY = image.yPos;
    largestX = image.xPos + image.width;
    largestY = image.yPos + image.height;

    var x = smallestX;
    var y = smallestY;
    

    while (x < largestX && y < largestY) {

      quadrants.push({x: x, y: y});

      x += troopIconSize;

      if (x > largestX) {
	x = smallestX;
	y += troopIconSize;
      }

    }

    return quadrants;
  }

  function getQuadrantsInsideTerritoryBoundary(squarePoints, context) {

    var territorySquares = [];
    for (var i = 0; i < squarePoints.length; i++) {
      var coords = squarePoints[i];

      var topLeft = {"x": coords.x, "y": coords.y};
      var topRight = {"x": coords.x + troopIconSize, "y": coords.y};

      var bottomLeft = {"x": coords.x, "y": coords.y + troopIconSize};
      var bottomRight = 
	{"x": coords.x + troopIconSize, "y": coords.y + troopIconSize};

      if (
	context.isPointInPath(topLeft.x, topLeft.y) 
	&& context.isPointInPath(topRight.x, topRight.y)
	&& context.isPointInPath(bottomLeft.x, bottomLeft.y) 
	&& context.isPointInPath(bottomRight.x, bottomRight.y)
      ) {
	territorySquares.push(topLeft);

      }

    }

    return territorySquares;
  }

}

function drawTerritoryOutline(coords, ctx) {

  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1]);
  for( item=2 ; item < coords.length-1 ; item+=2 ) {
    ctx.lineTo( coords[item] , coords[item+1] )
  }
  ctx.closePath();

}


},{"Dune/CanvasContainer":2,"Dune/Loader":13,"Dune/View/Map":27,"Dune/shuffle":33}],32:[function(require,module,exports){
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

},{"Dune/CanvasContainer":2,"Dune/EventChain":4,"Dune/Loader":13}],33:[function(require,module,exports){
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