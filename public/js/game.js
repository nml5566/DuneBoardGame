window.onload = function() {
  var gameView = new GameView();
  gameView.init();
}

function GameView() {
  this.init = init;

  function init() {
    initPlayButton();
    initFactionSelector();
  }

  function initPlayButton() {
    var playButton = document.getElementById("playbutton");

    playButton.onmouseover = function() {
      this.style.opacity = 0.6;
    }

    playButton.onmouseout = function() {
      this.style.opacity = 1.0;
    }
    playButton.onclick = playGame;
      
    function playGame() {

      var startScreen = document.getElementById("gamestartscreen");
      startScreen.style.display = "none";

      var factionSelectScreen = document.getElementById("factionselectscreen");
      factionSelectScreen.style.display = "block";
    }
  }

  function initFactionSelector() {
    var factionSelectIcon = "faction-select.png";
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

    var factionSelect = document.getElementById("factionselectcontainer");

    for (var i = 0; i < 6; i++) {
      var image = new Image();
      image.src = "/img/icons/" + factionSelectIcon;
      image.onclick = selectFactions;

      factionSelect.appendChild(image);
    }

    function selectFactions() {
      var icon = factionIcons.shift();

      if (this.factionInUse) 
	factionIcons.push(this.factionInUse);

      if (icon === factionSelectIcon) {
	delete this.factionInUse; 
	factionIcons.push(factionSelectIcon);
      } else {
	this.factionInUse = icon;
      }

      this.src = "/img/icons/" + icon;
    }
  }
}
