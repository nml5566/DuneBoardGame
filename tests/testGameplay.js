//module.exports = testGameplay;

var assert = require("assert");
var DuneGame = require("Dune/Game");
var game = new DuneGame();

var atreides = game.selectPlayer("Atreides");
var harkonnen = game.selectPlayer("Harkonnen");
var guild = game.selectPlayer("Guild");

console.log('start game');
game.start();
// Initial round
var map = game.map;

var atreidesTroops = atreides.getTroops(10);
var Arrakeen = map.getTerritory("Arrakeen");
atreidesTroops.occupy(Arrakeen);

var harkonnenTroops = harkonnen.getTroops(10);
var Carthag = map.getTerritory("Carthag");
harkonnenTroops.occupy(Carthag);

var atreidesTraitorHand =  atreides.drawTraitorHand();
assert(atreidesTraitorHand.length == 4);

var cardFaction = atreidesTraitorHand[0].faction
assert(cardFaction == "Harkonnen" || cardFaction == "Atreides", 
    "Didn't get expected traitor card faction");

var harkonnenTraitorHand = harkonnen.drawTraitorHand();
assert(harkonnenTraitorHand.length == 4);

var atreidesTraitor = atreidesTraitorHand[0];
atreides.pickTraitor(atreidesTraitor);

var harkonnenTraitor = harkonnenTraitorHand[0];
harkonnen.pickTraitor(harkonnenTraitor);

atreides.drawTreacheryCard();
harkonnen.drawTreacheryCard();

var initialStormPosition = map.initStormPosition();
assert(initialStormPosition >= 0);
assert(initialStormPosition <= 17);

// Start Game
while (! game.isOver()) {
  var newStormPosition = game.stormRound();

  testStormMovement(initialStormPosition, newStormPosition)

  initialStormPosition = newStormPosition;

  var territory = game.spiceBlowRound();

  var turnOrder = game.getTurnOrder();

  testTurnOrder(newStormPosition, turnOrder);

  // Bid round
  for (var i = 0; i < turnOrder.length; i++) {
    var player = turnOrder[i];
  }


  // Movement round
  for (var i = 0; i < turnOrder.length; i++) {
    var player = turnOrder[i];
  }

  game.battleRound();
  game.collectionRound();
  game.controlRound();
}

function testStormMovement(initialStormPosition, newStormPosition) {
  assert( newStormPosition != initialStormPosition, "Storm didn't change quadrants" );
  assert( newStormPosition >= 0 && newStormPosition <= 17, "Storm not in valid quadrant" );
  assert( 
    ( (newStormPosition - initialStormPosition <= 6) 
      || (initialStormPosition + 17 - newStormPosition <= 6) 
    ), "Storm moved more than 6 quadrants" );
}

function testTurnOrder(stormPosition, turnOrder) {
  var testOrder = [{"seat": stormPosition + 0.5 }].concat(turnOrder);
  testTurnOrderMovesCounterClockwise(testOrder);
}

function testTurnOrderMovesCounterClockwise(testOrder) {
  for (var i = 0; i < testOrder.length - 1; i++) {

    lastI = ( i - 1 < 0 ) ? ( turnOrder.length - 1 ) : i - 1;
    nextI = ( i + 1 >= testOrder.length ) ? 0 : (i + 1);

    var lastPosition = testOrder[lastI].seat;
    var currentPosition = testOrder[i].seat;
    var nextPosition = testOrder[nextI].seat;

    assert(
      (currentPosition < nextPosition && currentPosition > lastPosition)
      || (currentPosition < nextPosition + 18 && currentPosition > lastPosition)
      || (currentPosition < nextPosition && currentPosition + 18 > lastPosition)
      ,"Turn order not moving in counterclockwise fashion ahead of storm"
    );

  }
}

console.log('game over');
