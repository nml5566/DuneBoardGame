var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  drawPlayerScreen(gameController);
}

function drawPlayerScreen(controller) 
{
  var canvasContainer = controller.canvasContainer;
  var canvas = canvasContainer.layer('playerscreen');
  canvasContainer.moveLayerToTop(canvas);

  canvas.height = 172;

  var context = canvas.getContext("2d");

  context.fillStyle = "grey";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var loader = new controller.Loader();

  var iconScaleWidth = 67.5;
  var iconScaleHeight = 67.5;

  var deckScaleWidth = 100;
  var deckScaleHeight = 145;

  var padding = 10;

  var troopIconImgUrl = "/img/icons/troops/" + "atreides.png";
  var troopIconImg = loader.loadImage(troopIconImgUrl);
  troopIconImg.xPos = padding;
  troopIconImg.yPos = padding;

  var spiceIconImgUrl = "/img/icons/" + "spice-alt.png";
  var spiceIconImg = loader.loadImage(spiceIconImgUrl);
  spiceIconImg.xPos = padding;
  spiceIconImg.yPos = troopIconImg.yPos + iconScaleHeight + padding;

  var deckImgPath = "/img/deck/";

  var treacheryDeckImgUrl = deckImgPath + "treachery.png";
  var treacheryDeckImg = loader.loadImage(treacheryDeckImgUrl);
  treacheryDeckImg.xPos = spiceIconImg.xPos + iconScaleWidth + padding;
  treacheryDeckImg.yPos = 10;

  var traitorDeckImgUrl = deckImgPath + "traitor.png";
  var traitorDeckImg = loader.loadImage(traitorDeckImgUrl);
  traitorDeckImg.xPos = treacheryDeckImg.xPos + deckScaleWidth + padding;
  traitorDeckImg.yPos = padding;

  var bonusDeckImgUrl = deckImgPath + "bonus.png";
  var bonusDeckImg = loader.loadImage(bonusDeckImgUrl);
  bonusDeckImg.xPos = traitorDeckImg.xPos + deckScaleWidth + padding;
  bonusDeckImg.yPos = padding;

  var allianceDeckImgUrl = deckImgPath + "alliance.png";
  var allianceDeckImg = loader.loadImage(allianceDeckImgUrl);
  allianceDeckImg.xPos = bonusDeckImg.xPos + deckScaleWidth + padding;
  allianceDeckImg.yPos = padding

  var discScaleWidth = 50;
  var discScaleHeight = 50;

  var leaderDiscs = new Array(
    "dr._yueh", "duncan_idaho", "gurney_halleck", "lady_jessica", "thufir_hawat"
  );

  for (var i = 0; i < leaderDiscs.length; i++) {
    var leaderdiscImgUrl = "/img/leaders/atreides/" + leaderDiscs[i] + ".png";
    leaderDiscs[i] = loader.loadImage(leaderdiscImgUrl);

  }


  loader.onload = function() {

    context.drawImage(troopIconImg, 
    	troopIconImg.xPos, troopIconImg.yPos, 
    	iconScaleWidth, iconScaleHeight);

    context.drawImage(spiceIconImg, 
    	spiceIconImg.xPos, spiceIconImg.yPos, 
    	iconScaleWidth, iconScaleHeight);

    //context.globalAlpha = 0.5;

    context.drawImage(treacheryDeckImg, 
    	treacheryDeckImg.xPos, treacheryDeckImg.yPos, 
    	deckScaleWidth, deckScaleHeight);

    context.drawImage(traitorDeckImg, 
    	traitorDeckImg.xPos, traitorDeckImg.yPos, 
    	deckScaleWidth, deckScaleHeight);

    context.drawImage(bonusDeckImg, 
    	bonusDeckImg.xPos, bonusDeckImg.yPos, 
    	deckScaleWidth, deckScaleHeight);

    context.drawImage(allianceDeckImg, 
	  allianceDeckImg.xPos, allianceDeckImg.yPos, 
	  deckScaleWidth, deckScaleHeight);


    var leaderCircle = {
      "centerX": 600,
      "centerY": canvas.height/2,
      "radius": 75,
      "angle": 0
    };

/*    context.fillStyle = "black";*/
    //context.beginPath();
    //context.arc(
      //leaderCircle.centerX, leaderCircle.centerY,
      //leaderCircle.radius,
      //0, Math.PI*2
    //);
    /*context.fill();*/

    //context.strokeStyle = "white";

    var TO_RADIANS = Math.PI/180;
    var angle = 180/5 * TO_RADIANS;

    var leaderDiscRadius = 
      leaderCircle.radius / ( (1 - Math.sin(angle)) / Math.sin(angle) + 2 );

    console.log(leaderDiscRadius);
    console.log(leaderCircle.radius/3);

    for (var i = 0; i < 5; i++) {

      var degrees = 72;
      leaderCircle.angle = i * degrees * TO_RADIANS;


      var x = leaderCircle.centerX + Math.cos(leaderCircle.angle) 
      	* (2 * leaderCircle.radius / 3);
      var y = leaderCircle.centerY + Math.sin(leaderCircle.angle) 
      	* (2 * leaderCircle.radius / 3);
      
      // DEBUG to make sure leader discs properly aligned
      //context.beginPath();
      //context.arc(
                //x, y,
	  //leaderDiscRadius,
                //0, 2*Math.PI);
      //context.stroke();

      var leaderDiscImg = leaderDiscs[i];
      leaderDiscImg.xPos = x - leaderDiscRadius;
      leaderDiscImg.yPos = y - leaderDiscRadius;

      discScaleWidth = discScaleHeight = 2 * leaderDiscRadius;
      context.drawImage(leaderDiscImg, 
	leaderDiscImg.xPos, leaderDiscImg.yPos, 
	discScaleWidth, discScaleHeight);

    }
  }
}

