
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- Source code here -->
<script>
var DBNAME='game';
var GAMENAME='maze';
</script>
<head>
  <link rel="stylesheet" type="text/css" href="/assets/css/style.css">
  <script src="assets/js/maze.js"></script>
  <script src="assets/js/app.js"></script>
  <title> Maze Game</title>
</head>

<body>
<div id="nav">
        <div class="Title" style = "margin: 0em; margin-right: 2px;">MAZE GAME</div>
				<a href="index.php">*maze game</a>
				<a href="mazeSolverDemo.php">*maze solver</a>
        <a href="treeTraversals.php">*tree traversals</a>
</div>
<section id = "container">
  </section>
      <section id = "container">
        <p style="text-align: center; margin: 0px;"> *welcome: use wasd, the arrow keys, or the provided buttons to move your player</>
        <div style='position:absolute' id=players></div>
        <div style='position:absolute' id=star></div>
        <canvas id="canvas" class = "center" style="border:2px solid #000000;">
        </canvas>
        <div id= "buttons">
            <table align = "center">
                <center> <input type=button class=button value="Up" onclick="goUp()"></center>
                <center>
                  <input type=button class=button value="Left" onclick="goLeft()">
                  <input type=button class=button value="Down" onclick="goDown()">
                  <input type=button class=button value="Right" onclick="goRight()">
              </center>
            </table>
        </div>
      </section>
</body>
