window.onload = function() {
 new GameView();
}

function GameView() {

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

function FactionSelectView() {

  var container = document.getElementById("factionselectcontainer");
  var view = document.getElementById("factionselectscreen");

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

  var factionIcons = new Array(
      "atreides-emblem125x125.png",
      //"atreides-shield200x224.png",
      "fremen-emblem125x125.png",
      "guild-emblem125x125.png",
      "emperor-emblem125x125.png",
      "harkonnen-emblem125x125.png",
      "benegesserit-emblem125x125.png",
      factionSelectIcon
  );
  var factionImages = new Array();

  var startButton;

  var me = this;
  this.show = show;
  this.hide = hide;

  init();

  function show() {
    view.style.display = "block";
  }

  function hide() {
    view.style.display = "none";
  }

  function init() {
    makeFactionImageElements();
    makeBackButtonElement();
    makeStartButtonElement();
  }

  function makeFactionImageElements() {
    for (var i = 0; i < 6; i++) {
      var image = new Image();
      image.src = "/img/icons/" + factionSelectIcon;
      //image.onclick = factionSelector;
      image.onclick = factionSelector2;

      container.appendChild(image);
      factionImages.push(image);
    }
  }

  function makeBackButtonElement() {
    var backButton = new Image();
    backButton.src = "/img/icons/back.png";
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
    startButton.src = "/img/icons/start.png";
    startButton.style.opacity = 0.6;
    startButton.style.cursor = "default";
    container.appendChild(startButton);
  }


  function factionSelector() {
    var icon = factionIcons.shift();

    if (this.selectedFaction) 
      factionIcons.push(this.selectedFaction);

    if (icon === factionSelectIcon) {
      delete this.selectedFaction; 
      factionIcons.push(factionSelectIcon);
    } else {
      this.selectedFaction = icon;
    }

    this.src = "/img/icons/" + icon;

    checkIfGameReadyToStart();
  }

  function factionSelector2() {
    var faction = factions.shift();

    if (this.selectedFaction) 
      factions.push(this.selectedFaction);

    if (faction === factionSelect) {
      delete this.selectedFaction; 
      factions.push(factionSelect);
    } else {
      this.selectedFaction = faction;
    }

    this.src = "/img/icons/" + faction + "125x125.png";

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

function MapView(factions) {

  var view = document.getElementById("mapscreen");

  this.show = show;

  init();

  function show() {
    view.style.display = "block";
  }

  function init() {
    // TODO draw storm marker function
  }
}
