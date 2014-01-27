var assert = require("assert");
var DuneGame = require("Dune/Game");

module.exports = testGameplay;

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

  testTroops();


  var atreidesTraitorHand =  atreides.drawTraitorHand();
  assert(atreidesTraitorHand.length == 4);

  var cardFaction = atreidesTraitorHand[0].faction
  assert(cardFaction == "Harkonnen" || cardFaction == "Atreides" || cardFaction == "GuildFaction", 
      "Didn't get expected traitor card faction");

  var harkonnenTraitorHand = harkonnen.drawTraitorHand();
  assert(harkonnenTraitorHand.length == 4);

  var atreidesTraitor = atreidesTraitorHand[0];
  atreides.pickTraitor(atreidesTraitor);

  var harkonnenTraitor = harkonnenTraitorHand[0];
  harkonnen.pickTraitor(harkonnenTraitor);

  atreides.drawTreacheryCard();
  harkonnen.drawTreacheryCard();

  //var initialStormPosition = map.initStormPosition();
  map.initStormPosition();
  var initialStormPosition = map.stormSector;

  assert(initialStormPosition >= 0);
  assert(initialStormPosition <= 17);

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

    testSpiceBlowRound();


    var turnOrder = game.getTurnOrder();

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

  console.log('game over');
}

function testTroops()
{
  var atreidesTroops = atreides.getTroops(10);
  var Arrakeen = map.getTerritory("Arrakeen");
  atreidesTroops.occupy(Arrakeen);

  var harkonnenTroops = harkonnen.getTroops(10);
  var Carthag = map.getTerritory("Carthag");
  harkonnenTroops.occupy(Carthag);
}

function testStormMovement(initialStormPosition, newStormPosition) {
  assert( newStormPosition != initialStormPosition, "Storm didn't change quadrants" );
  assert( newStormPosition >= 0 && newStormPosition <= 17, "Storm not in valid quadrant" );
  assert( 
    ( (newStormPosition - initialStormPosition <= 6) 
      || (initialStormPosition + 17 - newStormPosition <= 6) 
    ), "Storm moved more than 6 quadrants" );
}

function testSpiceBlowRound() 
{
  var drawnTerritoriesCount = 0;
  var spiceCard = game.spiceBlowRound();
  while (spiceCard) 
  {
    if (spiceCard.spice) 
    {
      drawnTerritoriesCount++;
      var spice = spiceCard.spice;
      assert(spice == 6 || spice == 8 || spice == 10 || spice == 12,
	  "Spice card value not 6, 8, 10, or 12");
    } else { assert(spiceCard.isWorm, "Spice card has no spice and isn't worm") }

    spiceCard = game.spiceBlowRound();
  }

  assert(drawnTerritoriesCount == 2, 
      "Spice blow round didn't draw exactly 2 territories");

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
