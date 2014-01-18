window.onload = function() {
 new GameController();
 
 /* DEBUG MODE */
 var mapView = new MapView(["Atreides","Harkonnen"]);
 mapView.show();
}

function GameController() {

  var startView = new StartView();
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
    startView.hide();
    factionSelectView.show();
  }

}

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


function StartView() {

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
    //var Dune = require("Dune/Game");
    //var dune = Dune();
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
