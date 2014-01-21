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
