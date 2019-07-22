
var Maze = (function () {
  var LEFT = 0b0001; //1
  var RIGHT = 0b0010; //2
  var BOTTOM = 0b0100; //4
  var TOP = 0b1000; //8
  var MAZE_SIZE;

  function srand(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  class Maze {
    // generates the maze
    generate(seed, size) {
      MAZE_SIZE = size;
      this.currentSeed = seed;
      this.maze = new Array(MAZE_SIZE);

      var maze = this.maze;
      var seen = {};
      // initializes the 2d array to use as a maze
      for (var i = 0; i < MAZE_SIZE; ++i) {
        maze[i] = new Array(MAZE_SIZE);
        for (var j = 0; j < MAZE_SIZE; ++j) {
          // el in 2d maze array represented as 4 digit bit each representing a side
          maze[i][j] = LEFT | TOP | BOTTOM | RIGHT; 
          seen[this._hashKeyForCoord([i, j])] = false;
        }
      }

      var stack = [];
      var coord = [0, 0];
      var nextCoord;
      var seenCount = 0;
      // breaks down walls to create a maze and make sure we break down at least 1 wall for every position
      while (seenCount < MAZE_SIZE * MAZE_SIZE) {
        if (!seen[this._hashKeyForCoord(coord)]) {
          seenCount++;
        }
        seen[this._hashKeyForCoord(coord)] = true;

        var brokeWall = this._breakRandomWall(maze, coord, seen);
        if (brokeWall) {
          stack.push(coord);
          nextCoord = this._coordForDirection(coord, brokeWall);
        } else {
          nextCoord = stack.pop();
        }
        coord = nextCoord;
      }
    }

    // creates an empty maze for demonstrating graph traversal algorithms
    genEmpty(size) {
      MAZE_SIZE = size;
      this.maze = new Array(MAZE_SIZE);

      var maze = this.maze;
      // initializes the 2d array to use as a maze
      for (var i = 0; i < MAZE_SIZE; ++i) {
        maze[i] = new Array(MAZE_SIZE);
        for (var j = 0; j < MAZE_SIZE; ++j) {
          // el in 2d maze array represented as 4 digit bit each representing a side
          maze[i][j] = LEFT | TOP | BOTTOM | RIGHT; 
          maze[i][j] ^= TOP;
          maze[i][j] ^= BOTTOM;
          maze[i][j] ^= RIGHT;  
        }
      }
    }

    // end of "constructor" additional methods to use for Maze class
    // draws the maze onto the the web page
    draw(canvas) {
      var width = canvas.width();
      var c = canvas.get(0).getContext("2d"); //use to draw maze

      var gridSize = width / MAZE_SIZE;
      c.lineWidth = 2;
      c.clearRect(0, 0, canvas.width(), canvas.height());
      //border of of the maze is drawn

      c.beginPath();
      c.moveTo(0, gridSize);
      for (var y = 0; y < MAZE_SIZE; ++y) {
        for (var x = 0; x < MAZE_SIZE; ++x) {
          var item = this.maze[y][x];
          if ((item & BOTTOM) > 0) { // has a bottom wall
            c.moveTo(x * gridSize, (y + 1) * gridSize);
            c.lineTo((x + 1) * gridSize, (y + 1) * gridSize);
          }
          if ((item & RIGHT) > 0) { // has a right wall
            c.moveTo((x + 1) * gridSize, (y) * gridSize);
            c.lineTo((x + 1) * gridSize, (y + 1) * gridSize);
          }
        }
      }
      c.stroke();
      c.strokeRect(0, 0, canvas.width(), canvas.height());
    }

    // used to determine if the desired input direction for user i a valide move
    hasWall(pos, direction) {
      var walls = this.maze[pos[1]][pos[0]];
      return (walls & direction) > 0;
    }

    _hashKeyForCoord(c) { return c[0] + ',' + c[1]; }

    _coordForDirection(coord, direction) {
      var nextCoord = [coord[0], coord[1]];
      switch (direction) {
        case TOP:
          nextCoord[1]--;
          break;
        case LEFT:
          nextCoord[0]--;
          break;
        case BOTTOM:
          nextCoord[1]++;
          break;
        case RIGHT:
          nextCoord[0]++;
          break;
      }
      if (nextCoord[0] < 0 || nextCoord[0] >= MAZE_SIZE ||
        nextCoord[1] < 0 || nextCoord[1] >= MAZE_SIZE) return false;

      return nextCoord;
    }

    _oppositeDirection(direction) {
      switch (direction) {
        case LEFT: return RIGHT;
        case RIGHT: return LEFT;
        case TOP: return BOTTOM;
        case BOTTOM: return TOP;
      }
    }

    _breakRandomWall(maze, coord, seen) {
      var y = coord[1];
      var x = coord[0];
      var walls = maze[y][x];
      if (walls > 0) {
        var directions = [LEFT, TOP, BOTTOM, RIGHT];
        this._shuffleArray(directions);

        for (let dir of directions) {
          if (x == 0 && dir == LEFT) continue;
          if (x >= MAZE_SIZE - 1 && dir == RIGHT) continue;
          if (y == 0 && dir == TOP) continue;
          if (y >= MAZE_SIZE - 1 && dir == BOTTOM) continue;

          var otherWall = this._coordForDirection(coord, dir); //other wall is coordPos[][]
          if (!otherWall) continue; // check that the next pos on other side of wall is valid

          if (seen[this._hashKeyForCoord(otherWall)]) continue;
          if ((walls & dir) > 0) { // wall is not broken
            maze[y][x] ^= dir; //break down wall
            if (otherWall) {
              // breaks down wall in opposite direction
              maze[otherWall[1]][otherWall[0]] ^= this._oppositeDirection(dir);
            }
            return dir;
          }
        }
      }
      return 0;
    }

    _shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(this._random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    _random() {
      return srand(this.currentSeed++);
    }
  }

  return {
    Maze : Maze,
    LEFT: LEFT,
    TOP: TOP,
    RIGHT: RIGHT,
    BOTTOM: BOTTOM
  };
})();
