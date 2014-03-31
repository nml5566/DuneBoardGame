var assert = require("assert");
var DuneGame = require("Dune/Game");
var modulino = require("modulino");

module.exports = testGameplay;

modulino(testGameplay, module);

function testGameplay() 
{
  var game = new DuneGame();

  var atreides = game.selectPlayer("Atreides");
  var harkonnen = game.selectPlayer("Harkonnen");
  var guild = game.selectPlayer("Guild");

  console.log('start game');
  game.start();
  // Initial round
  var map = game.map;

  testTroopOccupation(map, atreides, harkonnen);

  testTraitorSelection(atreides, harkonnen);


  atreides.drawTreacheryCard();
  harkonnen.drawTreacheryCard();

  var initialStormPosition = testStormPosition(map);
  
  testTurnOrder();

  // Start Game
  while (! game.isOver()) {
    var stormMovement = game.stormRound();

    var newStormPosition = initialStormPosition + stormMovement;

    /* Reset storm quandrant position when it goes below 0 */
    var quadrants = 17;
    if (newStormPosition > quadrants)
      newStormPosition -= quadrants;


    testStormMovement(initialStormPosition, newStormPosition)

    initialStormPosition = newStormPosition;

    testSpiceBlow(game);


    testBidRound(game);
    testMovementRound(game);

    
    game.battleRound();
    game.collectionRound();
    game.controlRound();
  }

  console.log('game over');
}

function testTroopOccupation(map, atreides, harkonnen)
{
  var atreidesTroops = atreides.getTroops(10);
  var Arrakeen = map.getTerritory("Arrakeen");
  atreidesTroops.occupy(Arrakeen);

  var harkonnenTroops = harkonnen.getTroops(10);
  var Carthag = map.getTerritory("Carthag");
  harkonnenTroops.occupy(Carthag);
}

function testTraitorSelection(atreides, harkonnen) 
{
  var atreidesTraitorHand =  atreides.drawTraitorHand();
  assert(atreidesTraitorHand.length == 4);

  var cardFaction = atreidesTraitorHand[0].faction
  assert(cardFaction == "Harkonnen" || cardFaction == "Atreides" || cardFaction == "Guild", 
      "Didn't get expected traitor card faction");

  var harkonnenTraitorHand = harkonnen.drawTraitorHand();
  assert(harkonnenTraitorHand.length == 4);

  var atreidesTraitor = atreidesTraitorHand[0];
  atreides.pickTraitor(atreidesTraitor);

  var harkonnenTraitor = harkonnenTraitorHand[0];
  harkonnen.pickTraitor(harkonnenTraitor);

}

function testStormPosition(map) 
{
  map.initStormPosition();
  var initialStormPosition = map.stormSector;

  assert(initialStormPosition >= 0);
  assert(initialStormPosition <= 17);

  return initialStormPosition;
}

function testStormMovement(initialStormPosition, newStormPosition) {
  assert( newStormPosition != initialStormPosition, "Storm didn't change quadrants" );
  assert( newStormPosition >= 0 && newStormPosition <= 17, "Storm not in valid quadrant" );
  assert( 
    ( (newStormPosition - initialStormPosition <= 6) 
      || (initialStormPosition + 17 - newStormPosition <= 6) 
    ), "Storm moved more than 6 quadrants" );
}

function testSpiceBlow(game)
{
  testSpiceBlowRound(game);
}


function testSpiceBlowRound(game) 
{
  var drawnTerritoriesCount = 0;
  var spiceCards = game.spiceBlowRound();

  for (var i = 0; i < spiceCards.length; i++) 
  {
    var spiceCard = spiceCards[i];
    if (spiceCard.spice) 
    {
      drawnTerritoriesCount++;
      var spice = spiceCard.spice;
      assert(spice == 6 || spice == 8 || spice == 10 || spice == 12,
	  "Spice card value not 6, 8, 10, or 12");
    } else { assert(spiceCard.isWorm, "Spice card has no spice and isn't worm") }
  }

  assert(drawnTerritoriesCount == 2, 
      "Spice blow round didn't draw exactly 2 territories");

}

function testBidRound(game)
{
  var bidRound = game.bidRound();
  var minimumBid = bidRound.minimumBid();

  assert(minimumBid == 1, "Expect minimum bid is 1 spice");

  var player1 = bidRound.nextBidder();
  player1.placeBid(minimumBid);

  minimumBid = bidRound.minimumBid();
  assert(minimumBid == 2, "Expect minimum bid is 2 spice");

  var player2 = bidRound.nextBidder();

  var invalidBid = function() 
  {
    var spice = player2.spice();
    player2.placeBid(spice + 1);
  }

  assert.throws(invalidBid, Error, 
      "Expect bidding more spice than available throws Error");

  var oldTreacheryCardCount = player1.treacheryCardCount();

  player2.passBid();

  var player3 = bidRound.nextBidder();
  player3.passBid();

  var newTreacheryCardCount = player1.treacheryCardCount();

  assert(oldTreacheryCardCount + 1 == newTreacheryCardCount, 
      "Expect treachery card count increases by 1")

  //TODO test if all bidders pass
}

function testMovementRound(game)
{
  // Movement round
  var turnOrder = game.getTurnOrder();
  for (var i = 0; i < turnOrder.length; i++) {
    var player = turnOrder[i];
  }
}

function testTurnOrder() 
{

  testHarkonnenFirstPlayer();
  testAtreidesFirstPlayer();
  testDuplicateSeatsThrowError();

}

function testHarkonnenFirstPlayer() 
{
  var game = new DuneGame();

  var atreides = game.selectPlayer("Atreides");
  var harkonnen = game.selectPlayer("Harkonnen");

  atreides.seat = 13;
  harkonnen.seat = 1;
  game.map.stormSector = 4;

  var turnOrder = game.getTurnOrder();

  assert(turnOrder[0].constructor.name == "Harkonnen", "Harkonnen isn't first in turn order");

}

function testAtreidesFirstPlayer() 
{
  var game = new DuneGame();

  var atreides = game.selectPlayer("Atreides");
  var harkonnen = game.selectPlayer("Harkonnen");

  atreides.seat = 15;
  harkonnen.seat = 1;
  game.map.stormSector = 17;

  turnOrder = game.getTurnOrder();

  assert(turnOrder[0].constructor.name == "Atreides", "Atreides isn't first in turn order");

}

function testDuplicateSeatsThrowError() 
{
  var game = new DuneGame();

  var atreides = game.selectPlayer("Atreides");
  var harkonnen = game.selectPlayer("Harkonnen");

  atreides.seat = 10;
  harkonnen.seat = 10;

  assert.throws(
    function() 
    { 
      game.getTurnOrder() 
    },
    function(err) 
    {
      if (err instanceof Error) { return true }
    },
    "Factions with duplicate seats didn't throw turn order error");

}
