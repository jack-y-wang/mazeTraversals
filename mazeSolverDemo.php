
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- Source code here -->
<script>
var DBNAME='game';
var GAMENAME='maze';
</script>
<head>
  <script src="/assets/js/maze.js"></script>
  <script src="/assets/js/solver.js"></script>
  <script src="/assets/js/PriorityQueue.js"></script>
  <link rel="stylesheet" type="text/css" href="/assets/css/style.css">
  <title> Maze Solver </title>
</head>

<body>
<div id="nav">
        <div class="Title" style = "margin: 0em; margin-right: 2px;">Maze Solver  </div>
				<a href="index.php">*maze game</a>
				<a href="mazeSolverDemo.php">*maze solver</a>
        <a href="treeTraversals.php">*tree traversals</a>
</div>
      <section id = "container">
        <p style="text-align: center; margin: 0em;"> *select bfs, dfs, or A* to see these search algorithms done on the maze</p>
        <p style="text-align: center; margin: 0em;"> *please wait for algorithm to finish before choosing new option, otherwise pls refresh the page</p>
        <div style='position:absolute' id=players>
        </div>
        <canvas id="canvas" class = "center" style="border:2px solid #000000;">
        </canvas>
        <div id= "buttons">
            <table align = "center">
                <center>
                  <input type=button class=button value="BFS" onclick="bfs()">
                  <input type=button class=button value="DFS" onclick="solveDFS()">
                  <input type=button class=button value="A*" onclick="aStar()">
                  <input type=button class=button value="resetMaze" onclick="resetMaze()">
                  <input type=button class=button value="newMaze" onclick="newMaze()">
                  <input type=button class=button value="emptyMaze" onclick="emptyMaze()">
              </center>
            </table>
        </div>
      </section>
</body>