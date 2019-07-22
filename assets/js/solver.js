$(function () {
    var GRIDSIZE;
    var MAZE = new Maze.Maze();
    var PLAYERDIVS = {};
    var CURRENTSEED = 6;
    var SIZE = 20;
    var BOARD_SIZE = 0.78 * Math.min(window.innerHeight, window.innerWidth);
    var reset = false;
    var blank = false;

    // Class of the "node" in the maze containing the position and a distance attribute
    class Pos {
        constructor(coord, dist) {
            this.coord = coord //size 2 array containing the coording
            this.dist = dist // distance from the source
        }
    }
    // Class of a "node" in the maze, used for drawing on the page
    class Traveled {
        constructor(coord, uid) {
            this.coord = coord;
            this.uid = uid;
        }
    }
    // Que Class
    class Queue {
        constructor() { this.queue = [];}

        add(item) { this.queue.push(item);}

        remove() {
            if(this.isEmpty()) 
                return "Underflow"; 
            return this.queue.shift(); 
        }

        isEmpty() { return this.queue.length == 0; } 
    }

    // Breadth First Search Method
    window.bfs = function() {
        regenerateMaze();
        var edgeTo = {};
        var marked = {};
        for (var i = 0; i < SIZE; ++i) {
            for (var j = 0; j < SIZE; ++j) {
              marked[hashKeyForCoord([i, j])] = false;
            }
        }
        var visited = new Queue();
        var queue = new Queue();
        var currPos = new Pos([0, 0], 0);
        
        queue.add(currPos);
        while (!queue.isEmpty()) {
            currPos = queue.remove();
            var currCoord = currPos.coord;
            var currDist = currPos.dist;
            var uid = Math.round(Math.random() * 1000000);
            visited.add(new Traveled(currCoord, uid));
            marked[hashKeyForCoord(currCoord)] = true

            if (currCoord[0] == SIZE - 1 && currCoord[1] == SIZE - 1) {
                reset = false;
                draw(visited, edgeTo);
                return;
            }

            var adj = getAdj(currCoord);
            while (adj.length != 0) {
                var neighbor = adj.pop();
                if (!marked[hashKeyForCoord(neighbor)]) {
                    edgeTo[hashKeyForCoord(neighbor)] = currCoord;
                    var distTo = currDist + 1;
                    queue.add(new Pos(neighbor, distTo));
                    marked[hashKeyForCoord(neighbor)] = true;
                }
            }
        }
    } 

    // Performs the DFS Algorithm
    window.solveDFS = function() {
        regenerateMaze();
        var edgeTo = {};
        var marked = {};
        for (var i = 0; i < SIZE; ++i) {
            for (var j = 0; j < SIZE; ++j) {
              marked[hashKeyForCoord([i, j])] = false;
            }
        }
        var visited = new Queue();
        var currPos = new Pos([0, 0], 0);
        
        dfs(currPos, edgeTo, marked, visited);
    }

    //Depth First Search Method
    function dfs(currPos, edgeTo, marked, visited) {
        marked[hashKeyForCoord(currPos.coord)] = true;
        var uid = Math.round(Math.random() * 1000000);
        visited.add(new Traveled(currPos.coord, uid));
        var currCoord = currPos.coord;
        var currDist = currPos.dist;

        if (currCoord[0] == SIZE - 1 && currCoord[1] == SIZE - 1) {
            reset = false;
            draw(visited, edgeTo);
            return true;
        }
        
        var adj = getAdj(currCoord);
        while (adj.length != 0) {
            var neighbor = adj.pop();
                if (!marked[hashKeyForCoord(neighbor)]) {
                    edgeTo[hashKeyForCoord(neighbor)] = currCoord;
                    var distTo = currDist + 1;
                    finished = dfs(new Pos(neighbor, distTo), edgeTo, marked, visited)
                    if (finished == true) {
                        return true;
                    }
                }
        }
        return false;
    } 

    //A* Algorithm
    window.aStar = function() {
        regenerateMaze();
        var edgeTo = {};
        var distTo = {}
        var marked = {};
        for (var i = 0; i < SIZE; ++i) {
            for (var j = 0; j < SIZE; ++j) {
              marked[hashKeyForCoord([i, j])] = false;
            }
        }
        var visited = new Queue();
        var fringe = new PriorityQueue.PriorityQueue();
        var currPos = new Pos([0, 0], 0);
        
        fringe.push(currPos);
        while (!fringe.isEmpty()) {
            currPos = fringe.pop();
            var currCoord = currPos.coord;
            //var currDist = currPos.dist;
            var uid = Math.round(Math.random() * 1000000);
            visited.add(new Traveled(currCoord, uid));
            marked[hashKeyForCoord(currCoord)] = true

            if (currCoord[0] == SIZE - 1 && currCoord[1] == SIZE - 1) {
                reset = false;
                draw(visited, edgeTo);
                return;
            }

            var adj = getAdj(currCoord);
            while (adj.length != 0) {
                var neighbor = adj.pop();
                if (distTo[hashKeyForCoord(neighbor)] > distTo[hashKeyForCoord(currCoord)] + 1 || 
                        marked[hashKeyForCoord(neighbor)] == false) {
                    distTo[hashKeyForCoord(neighbor)] = distTo[hashKeyForCoord(currCoord)] + 1;
                    edgeTo[hashKeyForCoord(neighbor)] = currCoord;
                    fringe.push(new Pos(neighbor, _cost(currCoord, distTo)));
                    marked[hashKeyForCoord(neighbor)] = true;
                }
            }
        }
    }

    // cost model for A* search algorithm
    function _cost(currCoord, distTo) {
        return distTo[hashKeyForCoord(currCoord)] + _h(currCoord);
    }

    //heurisitc being used for A* search algorithm
    function _h(position) {
        return Math.abs(position[0] - SIZE - 1) + Math.abs(position[1] - SIZE - 1)
    }

    window.resetMaze = function() {
        regenerateMaze();
    }

    function regenerateMaze() {
        clearMaze();
        if (blank == true) {
            emptyMaze();
            return;
        }
        MAZE.generate(CURRENTSEED, SIZE);
        MAZE.draw($("#canvas"));
    }

    // Creates a new random maze
    window.newMaze = function() {
        blank = false;
        clearMaze();
        CURRENTSEED = Math.random();
        MAZE.generate(CURRENTSEED, SIZE);
        MAZE.draw($("#canvas"));
    }

    // Creates an empty maze
    // - used to more easily show differences between graph traversals
    window.emptyMaze = function() {
        blank = true;
        clearMaze();
        MAZE.genEmpty(SIZE);
        MAZE.draw($("#canvas"));
    }

    // Reset the maze
    function clearMaze() {
        reset = true;
        $("#players").empty();
        PLAYERDIVS = {};
        POS = [0, 0];
    }

    // draws the path found by the graph traversals
    async function draw(visited, edgeTo) {
        var path = getPath(edgeTo);
        while (!visited.isEmpty()) {
            await sleep(100);
            if (reset == true) {
                reset = false;
                return;
            }
            var visit = visited.remove();
            announce(visit.uid, visit.coord, path);
        }
    }

    // draws each visited coordinate in the graph
    function announce(uid, coord, winningPath) {
        if (winningPath[hashKeyForCoord(coord)]) {
              var div = $("<div id=player" + uid + " class=player style='background-color: #ffd1dc'></div>");
              $("#players").append(div);
                PLAYERDIVS[uid] = div;
        } else {
            var div = $("<div id=player" + uid + " class=player style='background-color: #f0f0f0'></div>");
              $("#players").append(div);
                PLAYERDIVS[uid] = div;
        }

        var circleSize = 25;
        var centerNudge = (window.innerWidth  - BOARD_SIZE) / 2 - GRIDSIZE/2;
        var offsetx = - circleSize / 2 + GRIDSIZE / 2;
        var offsety = - circleSize / 2 + GRIDSIZE / 2;
        var left = coord[0] * GRIDSIZE + offsetx;
        var top = coord[1] * GRIDSIZE + offsety;
        var css = { left: left + centerNudge, top: top, width: circleSize, height: circleSize };
        PLAYERDIVS[uid].css(css); 
    }

    // finds the path found from the graph traversal
    function getPath(edgeTo) {
        var winners = {};
        var pos = [SIZE - 1, SIZE - 1];
        while (pos[0] != 0 || pos[1] != 0) {
            winners[hashKeyForCoord(pos)] = true;
            pos = edgeTo[pos];
        }
        winners[hashKeyForCoord([0,0])] = true;
        return winners;
    }

    function hashKeyForCoord(c) { return c[0] + ',' + c[1]; }
    
    //returns possible next positions for a "node" in the graph
    function getAdj(coord) {
        var adj = [];
        var x = coord[0]
        var y = coord[1]
        if (!MAZE.hasWall(coord, Maze.RIGHT) && x < SIZE-1) {
            var x2 = x + 1;
            adj.push([x2,y]);
        } 
        if (!MAZE.hasWall(coord, Maze.BOTTOM) && y < SIZE-1){
            var y2 = y + 1;
            adj.push([x,y2]);
        }
        if (!MAZE.hasWall(coord, Maze.LEFT) && x > 0) {
            var x1 = x - 1;
            adj.push([x1, y]);
        } 
        if (!MAZE.hasWall(coord, Maze.TOP) && y > 0) {
            var y1 = y - 1;
            adj.push([x, y1]);
        } 
        return adj;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


    var canvas = $("#canvas");
    canvas.attr('width', BOARD_SIZE);
    canvas.attr('height', BOARD_SIZE);
    GRIDSIZE = canvas.width() / SIZE;
    CURRENTSEED = Math.random();
    MAZE.generate(CURRENTSEED, SIZE);
    MAZE.draw($("#canvas"));
  });
  