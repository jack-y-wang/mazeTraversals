// This code is sponsored by http://algoexpert.io/techlead
// by http://youtube.com/techlead

$(function () {
  var UID = Math.round(Math.random() * 1000000);
  var PLAYERDIVS = {};
  var POS = [0, 0];
  var GRIDSIZE;
  var MAZE = new Maze.Maze();
  var CURRENTSEED = 6;
  var SIZE =18;
  var BOARD_SIZE = 0.78 * Math.min(window.innerHeight, window.innerWidth);

  function monitorBoard() {
    clearMaze();
    CURRENTSEED = Math.random();
    monitorPlayers();
    MAZE.generate(CURRENTSEED, SIZE);
    MAZE.draw($("#canvas"));
  }

  function drawPlayer() {
    updatePlayerLocation(UID, POS, false);
  }

  function updatePlayerLocation(uid, coord, write = true) {
    if (!PLAYERDIVS[uid]) {
    //   create player
      var div = $("<div id=player" + uid + " class=player style='background-color:" + getRandomColor(uid) + "'></div>");
      $("#players").append(div);
        PLAYERDIVS[uid] = div;
    }

    var circleSize = 10;
    var nudge = GRIDSIZE * 0.25; // offset the player a bit randomly
    var centerNudge = (window.innerWidth  - BOARD_SIZE) / 2 - GRIDSIZE/2;
    var offsetx = nudge - 2 * srand(uid) * nudge - circleSize / 2 + GRIDSIZE / 2;
    var offsety = nudge - 2 * srand(uid + 1) * nudge - circleSize / 2 + GRIDSIZE / 2;
    var left = coord[0] * GRIDSIZE + offsetx;
    var top = coord[1] * GRIDSIZE + offsety;
    var css = { left: left + centerNudge, top: top, width: circleSize, height: circleSize };
    PLAYERDIVS[uid].css(css);

    $('#star').empty()
    var centerNudge = (window.innerWidth  - BOARD_SIZE) / 2 - GRIDSIZE/2;
    var star = $("<div class=player>&#x2605;</div>");
    star.css({left: BOARD_SIZE + centerNudge - GRIDSIZE/2 - 6, top: BOARD_SIZE - GRIDSIZE, border:0});
    $("#star").append(star);
  }

  function monitorPlayers() {
    drawPlayer();
    //updatePlayerLocation(UID, POS);
    repeater = setTimeout(monitorPlayers, 250);
  }

  function clearMaze() {
    $("#players").empty();
    /*var centerNudge = (window.innerWidth  - BOARD_SIZE) / 2 - GRIDSIZE/2;
    var star = $("<div class=player>&#x2605;</div>");
    star.css({left: BOARD_SIZE + centerNudge - GRIDSIZE/2 - 6, top: BOARD_SIZE - GRIDSIZE, border:0});
    $("#players").append(star);*/
    PLAYERDIVS = {};
    POS = [0, 0];
  }

  function startNewGame() {
    clearMaze();

    drawPlayer();
    CURRENTSEED = Math.random();
    MAZE.generate(CURRENTSEED, SIZE);
    MAZE.draw($("#canvas"));
  }

  window.goRight = function () {
    if (!MAZE.hasWall(POS, Maze.RIGHT)) {
      POS[0]++;
      updateMyPosition();
    }
  }
  window.goDown = function () {
    if (!MAZE.hasWall(POS, Maze.BOTTOM)) {
      POS[1]++;
      updateMyPosition();
    }
  }
  window.goLeft = function () {
    if (!MAZE.hasWall(POS, Maze.LEFT)) {
      POS[0]--;
      updateMyPosition();
    }
  }
  window.goUp = function () {
    if (!MAZE.hasWall(POS, Maze.TOP)) {
      POS[1]--;
      updateMyPosition();
    }
  }

  function updateMyPosition() {
    updatePlayerLocation(UID, POS);
    if (POS[0] == SIZE - 1 && POS[1] == SIZE - 1) {
      setTimeout(function(){
        alert("You won!");
        startNewGame();
      }, 100);
    }
  }

  function srand(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function getRandomColor(seed) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(srand(seed) * 16)];
      ++seed;
    }
    return color;
  }

  // Register key listeners
  $(document).keydown(function (e) {
    switch (e.keyCode) {
      case 37: //left arrow
        goLeft();
        break;
      case 38: //up arrow
        goUp();
        break;
      case 39: //right arrow
        goRight();
        break;
      case 40: //down arrow
        goDown();
        break;
      case 65: //left with a
        goLeft();
        break;
      case 87: //up with w
        goUp();
        break;
      case 68: //right with d
        goRight();
        break;
      case 83: //down with s
        goDown();
        break;
      default:
        return;
    }
    // Disable document scrolling.
    e.preventDefault();
  });

  var canvas = $("#canvas");
  canvas.attr('width', BOARD_SIZE);
  canvas.attr('height', BOARD_SIZE);
  var c = canvas.get(0).getContext("2d");
  GRIDSIZE = canvas.width() / SIZE;
  monitorBoard();
});
