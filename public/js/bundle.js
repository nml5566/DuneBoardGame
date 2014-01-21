(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  promptUserSelectTraitor(gameController);
  //draw(gameController);
}

var canvas, context;
function promptUserSelectTraitor(controller) {

  var canvasContainer = controller.canvasContainer;

  // debug to hide userPromptStart
  var debugCanvas = canvasContainer.layer('notification');
  debugCanvas.style.display = "none";

  canvas = canvasContainer.layer('debug');
  canvasContainer.moveLayerToTop(canvas);

  context = canvas.getContext("2d");

  var loader = new controller.Loader();
  var imageUrl = "/img/traitors/atreides/dr-yueh348x506.png";

  var image1 = loader.loadImage(imageUrl);

  var image2 = loader.loadImage(imageUrl);

  var image3 = loader.loadImage(imageUrl);
  var image4 = loader.loadImage(imageUrl);

  var scaleWidth = 275;
  var scaleHeight = 400;

  loader.onload = function() {
    console.log('traitor loaded');

    image1.xPos = 75;
    image1.yPos = 75;

    image2.xPos = canvas.width - scaleWidth - image1.xPos;
    image2.yPos = image1.yPos;

    image3.xPos = image1.xPos;
    image3.yPos = image2.yPos + image2.xPos - scaleWidth - image1.xPos + scaleHeight ;

    image4.xPos = image2.xPos;
    image4.yPos = image3.yPos;


    drawCaption();

    context.drawImage(
    	image1, image1.xPos, image1.yPos, scaleWidth, scaleHeight);

    context.drawImage(
    	image2, image2.xPos, image2.yPos, scaleWidth, scaleHeight);

    context.drawImage(
    	image3, image3.xPos, image3.yPos, scaleWidth, scaleHeight);

    context.drawImage(
    	image4, image4.xPos, image4.yPos, scaleWidth, scaleHeight);

  }

}

function drawCaption() {

  var captionDimensions = { 
    x: 0, y: 0,
    //x: 300, y: 20,
    //width: 120, height: 40
    width: 200, height: 80
  };


  context.beginPath();

  var buffer = 8;
  var buffer2 = 3.6;

  var bezierCtrlPt1X = captionDimensions.width + captionDimensions.x;
  //var bezierCtrlPt1Y = 36.4 + captionDimensions.y;
  var bezierCtrlPt1Y = captionDimensions.height - buffer2 + captionDimensions.y;

  //var bezierCtrlPt2X = 116.4 + captionDimensions.x;
  var bezierCtrlPt2X = captionDimensions.width - buffer2 + captionDimensions.x;
  //var bezierCtrlPt2Y = 40.0;
  var bezierCtrlPt2Y = captionDimensions.height + captionDimensions.y;

  //context.moveTo(120.0, 32.0);
  var startX = captionDimensions.x + captionDimensions.width; 
  var startY = captionDimensions.y + captionDimensions.height - buffer;
  context.moveTo(startX, startY);
    //captionDimensions.x + captionDimensions.width, 
    //bezierCtrlPt1X,
    //captionDimensions.y + captionDimensions.height
    //bezierCtrlPt2Y
  //);


  //var endingX = 112.0;
  var endingX = bezierCtrlPt1X - buffer;
  var endingY = bezierCtrlPt2Y;

  //context.bezierCurveTo(120.0, 36.4, 116.4, 40.0, 112.0, 40.0);

  context.bezierCurveTo(
      //120.0, 36.4,
      bezierCtrlPt1X, bezierCtrlPt1Y, 
      // 116.4, 40.0,
      bezierCtrlPt2X, bezierCtrlPt2Y, 
      // 112.0, 40.0);
      endingX, endingY);
  

  //context.lineTo(8.0, 40.0);
  context.lineTo(buffer + captionDimensions.x, endingY);


  //context.bezierCurveTo(3.6, 40.0, 0.0, 36.4, 0.0, 32.0);
  context.bezierCurveTo(
      buffer2 + captionDimensions.x , endingY, 
      captionDimensions.x, bezierCtrlPt1Y, 
      captionDimensions.x, bezierCtrlPt2Y - buffer);
  //context.lineTo(0.0, 8.0);
  context.lineTo(captionDimensions.x, captionDimensions.y + buffer);

  context.bezierCurveTo(
      //0.0, 3.6, 
      captionDimensions.x, captionDimensions.y + buffer2,
      //3.6, 0.0, 
      captionDimensions.x + buffer2, captionDimensions.y,
      //8.0, 0.0);
      buffer + captionDimensions.x, captionDimensions.y);

  //context.lineTo(112.0, 0.0);
  context.lineTo(endingX, captionDimensions.y);

  /* Top right corner */
  // TODO fix width calc
  context.bezierCurveTo(
      //116.4, 0.0, 
      bezierCtrlPt2X, captionDimensions.y,
      //120.0, 3.6, 
      bezierCtrlPt1X, buffer2 + captionDimensions.y,
      //120.0, 8.0);
      bezierCtrlPt1X, buffer + captionDimensions.y);

  //context.lineTo(120.0, 32.0);
  context.lineTo(startX, startY);

  context.closePath();

  context.fillStyle = "rgba(20, 20, 20, 0.6)";
  context.fill();
  context.lineWidth = 2.0;
  context.strokeStyle = "rgb(255, 255, 255)";
  context.stroke();

  //context.strokeStyle = "green";
  //context.strokeRect(captionDimensions.x, captionDimensions.y,
      //captionDimensions.width, captionDimensions.height);

}

function draw(controller) { 
  var canvasContainer = controller.canvasContainer;
  canvas = canvasContainer.layer('debug');
  canvasContainer.moveLayerToTop(canvas);

  var ctx = canvas.getContext("2d");

  ctx.beginPath(); 
  ctx.moveTo(120.0, 32.0); 
  ctx.bezierCurveTo(120.0, 36.4, 116.4, 40.0, 112.0, 40.0); 
  ctx.lineTo(8.0, 40.0); 
  ctx.bezierCurveTo(3.6, 40.0, 0.0, 36.4, 0.0, 32.0); 
  ctx.lineTo(0.0, 8.0); 
  ctx.bezierCurveTo(0.0, 3.6, 3.6, 0.0, 8.0, 0.0); 
  ctx.lineTo(112.0, 0.0); 
  ctx.bezierCurveTo(116.4, 0.0, 120.0, 3.6, 120.0, 8.0); 
  ctx.lineTo(120.0, 32.0); 
  ctx.closePath(); 
  ctx.fill(); 
  ctx.lineWidth = 2.0; 
  ctx.strokeStyle = "rgb(255, 255, 255)"; 
  ctx.stroke(); 
}

},{"Dune/Controller":2}],2:[function(require,module,exports){
module.exports = GameController;

var DuneGame = require("Dune/Game");
var MapView = require("./View/Map");
var StartMenuView = require("./View/StartMenu");
var FactionSelectView = require("./View/FactionSelect");

function GameController() {

  var turn = 0;
  var traitorPool = new Array();

  this.game = new DuneGame();
  this.canvasContainer = new CanvasContainer();
  this.Loader = Loader;

  this.players = { };
  this.views = {
    "map": new MapView(this),
    "start": new StartMenuView(this),
    "select":new FactionSelectView(this),
    "factions": {}
  };

  var that = this;

  this.startGame = function() {
    this.views.select.hide();

    that.game.start();

    initViews();

    this.startPlayerTurn();
  }

  function initViews() {
    initFactionViews();
    initMapView();
  }

  function initFactionViews() {
    for (var factionName in that.players) {
      var FactionView = getFactionViewConstructor(factionName);
      var factionView = new FactionView(that);
      factionView.loadImages();
      that.views.factions[factionName] = factionView;
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
      var player = this.game.selectPlayer(factionName);
      this.players[factionName] = player;
    }
  }

  function initMapView() {
    that.views.map.show();
    that.views.map.loadImages();
  }

  this.startPlayerTurn = function() {
    var turnOrder = this.game.getTurnOrder();
    var faction = turnOrder[0];

    var factionView = this.views.factions[faction.constructor.name];

    factionView.promptUserStartTurn();
  }  

}

function CanvasContainer() {

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


},{"./View/Faction/Atreides":13,"./View/Faction/BeneGesserit":15,"./View/Faction/Emperor":16,"./View/Faction/Fremen":17,"./View/Faction/Guild":18,"./View/Faction/Harkonnen":19,"./View/FactionSelect":20,"./View/Map":21,"./View/StartMenu":22,"Dune/Game":10}],3:[function(require,module,exports){
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

function BaseView(obj, props) {

  obj.imagePath = "/img/";
  obj.iconPath = obj.imagePath + "icons/";
  var view = props.view;

  obj.show = function() { view.style.display = "block" }
  obj.hide = function() { view.style.display = "none" }

}

},{}],13:[function(require,module,exports){
module.exports = AtreidesView;

var FactionDecorator = require("./Base");

//AtreidesView.prototype = new BaseFactionView();
//AtreidesView.prototype.constructor = AtreidesView;

function AtreidesView(controller) {
  FactionDecorator(this, {
    "faction": controller.players['Atreides'],
    "controller": controller,
    "icon": "atreides-emblem53x53.png"
  });

  var that = this;

  this.startInitialTurn = function() {
    this.promptUserStartTurn();
  }

  this._startInitialTurn = function() {
    this.promptUserSelectTraitor();
    // TODO
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

var ViewDecorator = require("../Base");

function BaseFactionView(obj, args) {

  ViewDecorator(obj, { "view": undefined });

  var controller = args.controller,
      faction = args.faction,
      icon = args.icon;

  var factionIcon; 
  var factionShieldImage;

  var self = this;

  obj.loadImages = function() {

    var loader = new controller.Loader();

    var factionIconUrl = obj.iconPath + icon;
    factionIcon = loader.loadImage(factionIconUrl)

    loader.onload = function() {
      obj.drawPlayerSeat();
    };

  }

  obj.promptUserStartTurn = function() {

    canvasContainer = controller.canvasContainer;
    canvas = canvasContainer.layer('notification');
    context = canvas.getContext("2d");


    canvasContainer.moveLayerToTop(canvas);

    canvas.addEventListener("mousedown", function(e) {
      dismissUserPromptNotification();
    });



    var loader = new controller.Loader();
    var factionShieldUrl = "/img/atreides-shield.png";

    factionShieldImage = loader.loadImage(factionShieldUrl);
    factionShieldImage.speed = 0.01;

    loader.onload = drawUserPromptNotification;

  }

  function dismissUserPromptNotification() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawUserPromptNotification() {

    factionShieldImage.xPos = 0;
    factionShieldImage.yPos = 0;

    factionShieldImage.yPos = -factionShieldImage.height;

    context.fillStyle = "rgba(20, 20, 20, 0.6)";
    context.fillRect (0,0,canvas.width,canvas.height);

    context.drawImage(
	factionShieldImage, factionShieldImage.xPos, factionShieldImage.yPos);

    moveImageToPoint(factionShieldImage, [0,250]);
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

    context.drawImage(image, image.xPos, image.yPos);

    if (image.yPos + image.yStep >= y) {
      clearInterval(image.movement);
      delete image.movement;
      delete image.xStep;
      delete image.yStep;

      dimScreen(image);

      image.xPos = x
      image.yPos = y

      context.drawImage(image, image.xPos, image.yPos);

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

  obj.selectTraitor = function(traitorName) {
    faction.setTraitor(traitorName);
  }

  obj.drawPlayerSeat = function() {

    var canvas = controller.canvasContainer.layer('playerseat');
    var context = canvas.getContext("2d");

    var mapView = controller.views.map;

    var circle = mapView.circle;
    circle.angle = mapView.convertSectorNumberToMapAngle(faction.seat);

    var iconOffset = factionIcon.width/2;

    var coordinates = 
      mapView.calculateSectorEdgeFromMapAngle([iconOffset, iconOffset]);

    var x = coordinates[0] - iconOffset;
    var y = coordinates[1] - iconOffset;

    context.drawImage(factionIcon, x, y);
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

var FactionDecorator = require("./Base");

//HarkonnenView.prototype = new BaseFactionView();
//HarkonnenView.prototype.constructor = HarkonnenView;

function HarkonnenView(controller) {

  FactionDecorator(this, {
    "faction": controller.players['Harkonnen'],
    "controller": controller,
    "icon": "harkonnen-emblem53x53.png"
  });

  var that = this;

  this.startInitialTurn = function() {
    this.promptUserStartTurn();
  }

  this._startInitialTurn = function() {
    this.promptUserSelectTraitor();
  }


}

},{"./Base":14}],20:[function(require,module,exports){
module.exports = FactionSelectView;

var ViewDecorator = require("./Base");
var MapView = require("./Map");

function FactionSelectView(controller) {

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


},{"./Base":12,"./Map":21}],21:[function(require,module,exports){
module.exports = MapView;

var ViewDecorator = require("./Base");

function MapView(controller) {

  ViewDecorator(this, { 
    "view": document.getElementById("mapscreen") 
  });

  var canvas = controller.canvasContainer.layer("storm");

  this.element = document.getElementById("mapscreen");

  var context = canvas.getContext("2d");

  var circle = {centerX:385, centerY:425, radius:338, angle: 0}
  this.circle = circle;

  var that = this;

  var stormImage;

  this.loadImages = function() {

    var loader = new controller.Loader();

    var stormImageUrl = "img/icons/storm-marker.png";
    stormImage = loader.loadImage(stormImageUrl);

    loader.onload = drawStormSetup;

    stormImage.xPos = 0; 
    stormImage.yPos = 0; 
    stormImage.speed = .01; 
    stormImage.radius = 25;
  }

  function drawStormSetup() {
    var stormSector = controller.game.map.initStormPosition();

    var img = stormImage;

    var w = img.width;
    var h = img.height;

    var x = -w/2;
    var y = -h/2;

    circle.angle = that.convertSectorNumberToMapAngle(stormSector);

    var coordinates = that.calculateSectorEdgeFromMapAngle();
    coordinates[0] += x, coordinates[1] += y;

    context.save();
    context.translate(coordinates[0],coordinates[1]);
    context.translate(img.width/2, img.height/2);

    var TO_RADIANS = Math.PI/180;
    var degreesPerSector = 20;
    var degrees = (stormSector - 3) * degreesPerSector;

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



},{"./Base":12}],22:[function(require,module,exports){
module.exports = StartMenuView;

var ViewDecorator = require('./Base');

function StartMenuView(controller) {

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