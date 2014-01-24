(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var gameController = require("Dune/Controller");

window.onload = function() {
  

  //var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  testTerritoryClick();
}

function testTerritoryClick()
{
  //var map = document.getElementsByName("map")[0];;
  //console.log(map);

/*  var canvasContainer = require("Dune/CanvasContainer");*/
  //var canvas = canvasContainer.getTopLayer();


  //var ctx = canvas.getContext("2d");

  //var territories = [ 
    //[
      //"Cielago North",
      //[411,473,395,485,373,485,361,467,301,571,303,576,303,579,320,594,361,598,367,593,383,594,418,616,429,608,441,588,450,579,458,554]
    //],
    //[
      //"Polar Sink",
      //[374,484,368,476,361,466,350,466,341,462,332,454,327,454,321,446,324,425,333,408,348,397,366,395,379,391,384,387,390,387,397,394,409,394,413,392,425,392,436,405,434,425,424,439,418,453,411,461,410,473,395,484]
    //]
  //];

 
  //canvas.addEventListener('click', function(e) {
    //var coord = getMousePosition(this,e);

    //for (var i = 0; i < territories.length; i++) 
    //{
      //var territory = territories[i];
      //var name = territory[0];
      //var coords = territory[1];

      //drawTerritoryOutline(coords, ctx);

      //if (ctx.isPointInPath(coord.x, coord.y)) 
	//console.log('clicked ' + name);
    //}

  /*});*/

  
  var areaTags = document.getElementsByTagName("area");
  for (var i = 0; i < areaTags.length; i++) {
    var areaTag = areaTags[i];
    areaTag.addEventListener('click', function(e) {
      console.log(this.target);
    });
  }
  console.log(areaTags);

  var territoryScreen = document.getElementById("territoryscreen");
  territoryScreen.style.display = "block";
  territoryScreen.style.zIndex = 200;
  /*console.log(test);*/
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

function getMousePosition(canvasElement,e)
{
  var rect = canvasElement.getBoundingClientRect();
  var mousex = e.clientX - rect.left; 
  var mousey = e.clientY - rect.top;

  return {x: mousex, y: mousey};
}



},{"Dune/Controller":3}],2:[function(require,module,exports){
module.exports = new CanvasContainer;

function CanvasContainer() 
{

  var container = document.getElementById("gamecontainer");

  var layerMap = { };
  var layerOrder = [];
  var zIndexMin = 99;
  
  this.layer = function(layerName) {
    if (! layerMap[layerName]) 
      newLayer(layerName);

    return layerMap[layerName]
  }

  function newLayer(layerName) {
    var canvas = document.createElement("canvas");

  
    layerMap[layerName] = canvas;

    /* Start layers at bottom to prevent newLayer() race conditions*/
    /* Code should manually call moveLayerToTop() */
    layerOrder.push(canvas);

    setCanvasAttributes(canvas, layerName);

    container.appendChild(canvas);
  }

  function setCanvasAttributes(canvas, layerName) {
    var zIndex = zIndexMin - layerOrder.length;

    canvas.id = layerName;
    canvas.className = "gamelayer";
    canvas.style.display = "block";
    canvas.style.zIndex = zIndex;
    canvas.width = 768;
    canvas.height = 1024;

  }

  this.moveLayerToTop = function(canvas) {
    var newIndex = 0;
    var oldIndex = getLayerIndex(canvas);

    layerOrder.splice(newIndex, 0, layerOrder.splice(oldIndex, 1)[0]);
    canvas.style.zIndex = zIndexMin + layerOrder.length;

  }

  function getLayerIndex(canvas) {
    for (var i = 0; i < layerOrder.length; i++) {
      var layer = layerOrder[i];
      if (layer.id == canvas.id) {
      	return i;
      }
    }

    throw new Error("Canvas element " + canvas.id + " not in layers");
  }

  this.getTopLayer = function() 
  {
    return layerOrder[0];
  }

  this.deleteLayer = function(canvas) 
  {
    var canvasIndex = getLayerIndex(canvas);
    layerOrder.splice(canvasIndex, 1);
    delete layerMap[canvas.id];

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

  this.startGame = function() 
  {
    gameView.game.start();

    hideFactionSelectView();
    initViews();
    // DEBUG skip intro
    //this.startInitialPlayerTurn();
  }

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
      //this.players[factionName] = player;
      gameView.players[factionName] = player;
    }
  }


  this.startInitialPlayerTurn = function() {
    var turnOrder = gameView.game.getTurnOrder();
    var faction = turnOrder[0];

    var factionView = factionViews[faction.constructor.name];

    factionView.startInitialTurn();
  }  

}



Image.prototype.moveToCoord = function(point) {
  var image = this;

  if (!image.canvas) {
    throw new Error("Image has no canvas property");
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


},{"./CanvasContainer":2,"./Loader":12,"./View/Faction/Atreides":16,"./View/Faction/BeneGesserit":18,"./View/Faction/Emperor":19,"./View/Faction/Fremen":20,"./View/Faction/Guild":21,"./View/Faction/Harkonnen":22,"./View/FactionSelect":23,"./View/Game":24,"./View/Map":25,"./View/StartMenu":27}],4:[function(require,module,exports){
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


},{"./Base.js":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./Base.js":5}],7:[function(require,module,exports){
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

},{"./Base.js":5}],8:[function(require,module,exports){
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


},{"./Base.js":5}],9:[function(require,module,exports){
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

},{"./Base.js":5}],10:[function(require,module,exports){
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

},{"./Base.js":5}],11:[function(require,module,exports){
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


},{"./Faction/Atreides":4,"./Faction/BeneGesserit":6,"./Faction/Emperor":7,"./Faction/Fremen":8,"./Faction/Guild":9,"./Faction/Harkonnen":10,"./Map":13,"./shuffle":29}],12:[function(require,module,exports){
module.exports = Loader;

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


},{}],13:[function(require,module,exports){
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

},{"./shuffle":29}],14:[function(require,module,exports){
module.exports = BaseView;

function BaseView(obj, props) {

  obj.imagePath = "/img/";
  obj.iconPath = obj.imagePath + "icons/";
  var view = props.view;

  obj.show = function() { view.style.display = "block" }
  obj.hide = function() { view.style.display = "none" }

}

},{}],15:[function(require,module,exports){
module.exports = TreacheryDeckView;
//var controller = require("../../Controller");
var mapView = require("Dune/View/Map");
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");

function TreacheryDeckView() 
{
  //var canvasContainer = controller.canvasContainer;
  var canvas;
  var context;

  //var loader = new controller.Loader();
  var loader = new Loader();

  var cardScaleWidth = 333,
      cardScaleHeight = 483;

  var treacheryImgUrl = "/img/treachery/chrysknife.png";
  var treacheryImg = loader.loadImage(treacheryImgUrl);

  var that = this;

  this.dealCard = function() 
  {
    canvas = canvasContainer.layer("notification");
    context = canvas.getContext("2d");
    canvasContainer.moveLayerToTop(canvas);


    //var mapDimensions = controller.views.map.circle;
    var mapDimensions = mapView.circle;

    var xPos = mapDimensions.centerX - cardScaleWidth/2;
    var yPos = mapDimensions.centerY - cardScaleHeight/2;

    canvas.redraw = function() { 
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    treacheryImg.canvas = canvas;
    treacheryImg.xPos = canvas.width;
    treacheryImg.yPos = yPos;
    treacheryImg.speed = 0.02;
    treacheryImg.width = cardScaleWidth;
    treacheryImg.height = cardScaleHeight;

    var xCenterScreen = mapDimensions.centerX - cardScaleWidth/2;
    var yCenterScreen = mapDimensions.centerY - cardScaleHeight/2;

    treacheryImg.moveToCoord([xCenterScreen, yCenterScreen]);

    treacheryImg.onHalt = function() {
      setTimeout(function() { 

	var xPos = 0 - cardScaleWidth;
	var yPos = yCenterScreen;

	treacheryImg.moveToCoord([xPos, yPos]);

	treacheryImg.onHalt = function() {

	  canvasContainer.deleteLayer(canvas);

	  if (that.onDealCard) {
	    that.onDealCard(this);
	    delete that.onDealCard;
	  }
	}


      }, 1000);

    }

    return treacheryImg;
  }
}

},{"Dune/CanvasContainer":2,"Dune/Loader":12,"Dune/View/Map":25}],16:[function(require,module,exports){
module.exports = AtreidesView;

var FactionDecorator = require("./Base");
var controller = require("../../Controller");
var gameView = require("Dune/View/Game");

function AtreidesView() {

  var images = {
    "troop": "atreides.png",
    "leaderPath": "/img/leaders/atreides/",
    "leaders": [ "dr._yueh.png", "duncan_idaho.png", "gurney_halleck.png", 
      "lady_jessica.png", "thufir_hawat.png" ],
    "emblem": "atreides-53x53.png"
  }

  FactionDecorator(this, {
    "faction": gameView.players['Atreides'],
    "images": images
  });

}

},{"../../Controller":3,"./Base":17,"Dune/View/Game":24}],17:[function(require,module,exports){
module.exports = BaseFactionView;

var ViewDecorator = require("../Base");
var TreacheryDeckView = require("../Deck/Treachery.js");
var PlayerScreen = require("../PlayerScreen");
var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");
var mapView = require("Dune/View/Map");

var promptUserSelectTraitor = require("../TraitorSelect.js");

function BaseFactionView(obj, args) {

  ViewDecorator(obj, { "view": undefined });

  var faction = args.faction,
      images = args.images;

  obj.faction = faction;

  var playerScreen = new PlayerScreen(images);
  var treacheryDeckView = new TreacheryDeckView();

  var factionEmblemImg, 
      factionShieldImg;

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

  obj.promptUserStartTurn = function() {

    canvas = canvasContainer.layer("notification");
    context = canvas.getContext("2d");

    canvasContainer.moveLayerToTop(canvas);

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

    if (obj.onStartTurn) {
      obj.onStartTurn();
      delete obj.onStartTurn;
    }
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

  obj.promptUserSelectTraitor = promptUserSelectTraitor;

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

  obj.startInitialTurn = function() 
  {
    // DEBUG skip all the prompting 

    this.promptUserStartTurn();
    this.onStartTurn = function() { 
      playerScreen.draw();


      obj.promptUserSelectTraitor();
      obj.onSelectTraitor = function() 
      {
	playerScreen.addTraitorCard(obj.traitorCardImage);
	playerScreen.onHandUpdate = function() {
	  obj.drawTreacheryCard();
	}
      }

    };

    //playerScreen.draw();
    //obj.drawTreacheryCard();
    //playerScreen.addTreacheryCard();
  }

  obj.drawTreacheryCard = function()
  {
    var card = treacheryDeckView.dealCard();
    treacheryDeckView.onDealCard = function(treacheryCardImg) {
      playerScreen.addTreacheryCard(card);
    }

  }
}

},{"../Base":14,"../Deck/Treachery.js":15,"../PlayerScreen":26,"../TraitorSelect.js":28,"Dune/CanvasContainer":2,"Dune/Loader":12,"Dune/View/Map":25}],18:[function(require,module,exports){

},{}],19:[function(require,module,exports){
module.exports=require(18)
},{}],20:[function(require,module,exports){
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

},{"./Base":17,"Dune/Game":11}],21:[function(require,module,exports){
module.exports=require(18)
},{}],22:[function(require,module,exports){
module.exports = HarkonnenView;

var FactionDecorator = require("./Base");
var gameView = require("Dune/View/Game");
var controller = require("../../Controller");

function HarkonnenView() {

  var images = {
    "troop": "harkonnen.png",
    "leaderPath": "/img/leaders/harkonnen/",
    "leaders": [ "beast_rabban.png", "captain_iakin_nefud.png", "feyd_rautha.png", 
      "piter_de_vries.png", "umman_kudu.png" ],
    "emblem": "harkonnen-53x53.png"
  }

  FactionDecorator(this, {
    "faction": gameView.players['Harkonnen'],
    "images": images
  });

  var that = this;

}

},{"../../Controller":3,"./Base":17,"Dune/View/Game":24}],23:[function(require,module,exports){
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


},{"./Base":14,"Dune/Controller":3}],24:[function(require,module,exports){
var DuneGame = require("Dune/Game");

module.exports = new GameView();

function GameView() 
{
  this.game = new DuneGame();
  this.players = {};
}

},{"Dune/Game":11}],25:[function(require,module,exports){

var ViewDecorator = require("./Base");
var gameView = require("Dune/View/Game");
var Loader = require("Dune/Loader");
var canvasContainer = require("Dune/CanvasContainer");

module.exports = new MapView();

function MapView() {

  ViewDecorator(this, { 
    "view": document.getElementById("mapscreen") 
  });

  //var controller = require("Dune/Controller");
  //var canvas = controller.canvasContainer.layer("storm");
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



},{"./Base":14,"Dune/CanvasContainer":2,"Dune/Loader":12,"Dune/View/Game":24}],26:[function(require,module,exports){
module.exports = PlayerScreen;
//var controller = require("Dune/Controller");
var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");

function PlayerScreen(images) 
{

  //var canvasContainer = controller.canvasContainer,
  var canvas = canvasContainer.layer('playerscreen'),
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
    canvasContainer.moveLayerToTop(canvas);

    troopIconImg = images.troop;
    troopIconImg.xPos = padding;
    troopIconImg.yPos = padding;

    var spiceIconImgUrl = "/img/icons/" + "spice-alt.png";
    spiceIconImg = loader.loadImage(spiceIconImgUrl);
    spiceIconImg.xPos = padding;
    spiceIconImg.yPos = troopIconImg.yPos + iconScaleHeight + padding;

    loadPlayerHandImages();

    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.redraw = drawPlayerScreen;

    loader.onload = function() { canvas.redraw() }
  }

  function drawPlayerScreen()
  {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(troopIconImg, 
	troopIconImg.xPos, troopIconImg.yPos, 
	iconScaleWidth, iconScaleHeight);

    context.drawImage(spiceIconImg, 
	spiceIconImg.xPos, spiceIconImg.yPos, 
	iconScaleWidth, iconScaleHeight);

    context.globalAlpha = transparent;

    drawPlayerHandImage(treacheryDeckImg, treacheryHand);
    drawPlayerHandImage(traitorDeckImg, traitorHand);
    drawPlayerHandImage(bonusDeckImg, bonusHand);
    drawPlayerHandImage(allianceDeckImg, allianceHand);

    context.globalAlpha = solid;


    var leaderDiscs = images.leaders;
    drawLeaderDiscs(leaderDiscs);
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
      updateHandCount(image, playerHand);


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
  }

  function loadTraitorHand()
  {
    var traitorDeckImgUrl = deckImgPath + "traitor.png";
    traitorDeckImg = loader.loadImage(traitorDeckImgUrl);
    traitorDeckImg.xPos = treacheryDeckImg.xPos + deckScaleWidth + padding;
    traitorDeckImg.yPos = padding;
  }

  function loadBonusHand()
  {
    var bonusDeckImgUrl = deckImgPath + "bonus.png";
    bonusDeckImg = loader.loadImage(bonusDeckImgUrl);
    bonusDeckImg.xPos = traitorDeckImg.xPos + deckScaleWidth + padding;
    bonusDeckImg.yPos = padding;
  }

  function loadAllianceHand()
  {
    var allianceDeckImgUrl = deckImgPath + "alliance.png";
    allianceDeckImg = loader.loadImage(allianceDeckImgUrl);
    allianceDeckImg.xPos = bonusDeckImg.xPos + deckScaleWidth + padding;
    allianceDeckImg.yPos = padding
  }

  function drawLeaderDiscs(leaderDiscs) 
  {
    var discScaleWidth = 50;
    var discScaleHeight = 50;

    var leaderCircle = {
      "centerX": 600,
      "centerY": canvas.height/2,
      "radius": 75,
      "angle": 0
    };

    var TO_RADIANS = Math.PI/180;
    var numberOfDiscs = 5;
    var angle = 180/numberOfDiscs * TO_RADIANS;

    /* Calculate largest radius for 5 smaller circles that can fit in larger 
    * circle using steiner chain formula */
    var leaderDiscRadius = 
      leaderCircle.radius / ( (1 - Math.sin(angle)) / Math.sin(angle) + 2 );

    for (var i = 0; i < 5; i++) {

      var degrees = 360 / numberOfDiscs;
      /* Angle arranges discs in star formation */
      leaderCircle.angle = (i * degrees * TO_RADIANS) - angle/2;

      var x = leaderCircle.centerX + Math.cos(leaderCircle.angle) 
	* (2 * leaderCircle.radius / 3);
      var y = leaderCircle.centerY + Math.sin(leaderCircle.angle) 
	* (2 * leaderCircle.radius / 3);
      
      var leaderDiscImg = leaderDiscs[i];
      leaderDiscImg.xPos = x - leaderDiscRadius;
      leaderDiscImg.yPos = y - leaderDiscRadius;

      discScaleWidth = discScaleHeight = 2 * leaderDiscRadius;
      context.drawImage(leaderDiscImg, 
	leaderDiscImg.xPos, leaderDiscImg.yPos, 
	discScaleWidth, discScaleHeight);

    }
  }

  this.addTraitorCard = function(traitorCardImg) 
  {
    addCardToHand(traitorCardImg, traitorDeckImg);
    traitorCardImg.onHalt = function() { 
      traitorHand.push(traitorCardImg);
      canvas.redraw() 
    }
  }

  this.addTreacheryCard = function(treacheryCardImg) 
  {
    addCardToHand(treacheryCardImg, treacheryDeckImg);
    treacheryCardImg.onHalt = function() { 
      treacheryHand.push(treacheryCardImg);
      canvas.redraw() 
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
    //cardImg.onHalt = function() { updateHandCount(playerHandImg) }
  }

  function updateHandCount(playerHandImg, playerHand)
  {
    //if (! playerHand.length)
      //return context.globalAlpha = transparent;

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
}


},{"Dune/CanvasContainer":2,"Dune/Loader":12}],27:[function(require,module,exports){
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


},{"./Base":14,"Dune/Controller":3}],28:[function(require,module,exports){
module.exports = promptUserSelectTraitor;

var canvasContainer = require("Dune/CanvasContainer");
var Loader = require("Dune/Loader");

var canvas, context, canvasContainer;

var traitorScaleWidth = 275,
    traitorScaleHeight = 400;

var factionView;

function promptUserSelectTraitor() 
{
  factionView = this;

  canvas = canvasContainer.layer('notification');
  canvasContainer.moveLayerToTop(canvas);


  context = canvas.getContext("2d");

  var loader = new Loader();

  faction = factionView.faction;
  var traitorHand = faction.drawTraitorHand();

  canvas.elements = new Array();

  for (var i = 0; i < traitorHand.length; i++) {
    var traitor = traitorHand[i];
    var factionName = traitor.faction.toLowerCase().split(' ').join('');

    var imageUrl = "/img/traitors/" + factionName + "/" 
      + traitor.name.toLowerCase().split(' ').join('_') + ".png";

    var image = loader.loadImage(imageUrl);
    image.traitor = traitor;
    canvas.elements[i] = image;
  }


  canvas.addEventListener('click', function(e) {
    var coord = getMousePosition(this,e);

    for (var i = 0; i < this.elements.length; i++) {
      var image = this.elements[i];

      if (coord.x >= image.xPos && coord.x <= image.xPos + traitorScaleWidth
	  && coord.y >= image.yPos && coord.y <= image.yPos + traitorScaleHeight
      ) {
      	selectTraitorImage(image);
      }
    }

  });

  loader.onload = drawTraitorSelectScreen;
}

function getMousePosition(canvasElement,e)
{
  var rect = canvasElement.getBoundingClientRect();
  var mousex = e.clientX - rect.left; 
  var mousey = e.clientY - rect.top;

  return {x: mousex, y: mousey};
}

function selectTraitorImage(image)
{
  factionView.traitorCardImage = image;

  var traitorObj = image.traitor;
  var faction = factionView.faction;
  faction.pickTraitor(traitorObj);

  canvasContainer.deleteLayer(canvas);

  if (factionView.onSelectTraitor) {
    factionView.onSelectTraitor();
    delete factionView.onSelectTraitor;
  }
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

},{"Dune/CanvasContainer":2,"Dune/Loader":12}],29:[function(require,module,exports){
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