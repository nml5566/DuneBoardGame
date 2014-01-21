var GameController = require("Dune/Controller");

window.onload = function() {
  

  var gameController = new GameController();

  /* DEBUG MODE */
  gameController.setFactions(new Array("Atreides", "Harkonnen"));
  gameController.startGame();

  //userPromptStartTurn(gameController);
}

var canvasContainer; 
var canvas;
var context;
var factionShieldImage;

function userPromptStartTurn(controller) {

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
  //context.clearRect(image.xPos, image.yPos,
    //image.width, image.height);
  //}
}
