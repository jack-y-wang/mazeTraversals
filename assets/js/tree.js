$(function () {
    var btree;
    var canvas;

    //Source of Tree and Node: https://codepen.io/m10digital/pen/egmJev Michael Diez
    // Represents the node in the tree. Will be displayed as a small circle in the browser.
    // x, y --> x, y co-ordinates of the center of circle
    // r    --> radius of the circle
    // ctx  --> context of the canvas
    // data --> data to be displayed (Only number)

    var Node = function(x,y,r, ctx, data) {
        this.leftNode = null; 
        this.rightNode = null;
        
        // draw function. Responsible for drawing the node
        this.draw = function() {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2*Math.PI); 
            ctx.stroke();
            ctx.closePath();
            ctx.strokeText(data, x-2, y+2);
        };

        // draw function. Responsible for drawing the node
        this.drawVisited = function() {
            //ctx.strokeStyle = "#ffd1dc";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2*Math.PI); 
            //ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = "#ffd1dc";
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.strokeText(data, x-2, y+2);
        };

        this.drawSeen = function() {
            //ctx.strokeStyle = "#ffd1dc";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2*Math.PI); 
            //ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = "#f0f0f0";
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.strokeText(data, x-2, y+2);
        }
        
        // Simple getters
        this.getData = function() { return data; }; 
        this.getX = function() { return x; };
        this.getY = function() { return y; };
        this.getRadius = function() { return r; };
        
        // Returns coordinate for the left child
        // Go back 3 times radius in x axis and 
        // go down 3 times radius in y axis
        this.leftCoordinate = function() {
            return {cx: (x - (3*r)), cy: (y + (3*r))}
        };
        // Same concept as above but for right child        
        this.rightCoordinate = function() {
            return {cx: (x + (3*r)), cy: (y+(3*r))}
        };
    };
    
    // Draws a line from one circle(node) to another circle (node) 
    var Line = function() {
        // Takes 
        // x,y      - starting x,y coordinate
        // toX, toY - ending x,y coordinate
        this.draw = function(x, y, toX, toY, r, ctx) {
            var moveToX = x;
            var moveToY = y + r;
            var lineToX = toX;
            var lineToY = toY - r;
            ctx.beginPath();
            ctx.moveTo(moveToX, moveToY);
            ctx.lineTo(lineToX, lineToY);
            ctx.stroke(); 
        };
    };
    
    // Represents the btree logic
    var BTree = function() {
        var c = document.getElementById('canvas');
        canvas = c;
        var ctx = c.getContext('2d');
        var line = new Line();
        this.root = null;
        
        var self = this;
        
        // Getter for root
        this.getRoot = function() { return this.root; };
        
        // Adds element to the tree
        this.add = function( data) {
            if(this.root) {
                this.recursiveAddNode(this.root, null, null, data);  
            } else {
            // If not, the add the element as a root 
                this.root = this.addAndDisplayNode(200, 20, 20, ctx, data);
                return;
            } 
        }
    
        // Helper Function to add node to Binary Search Tree
        this.recursiveAddNode = function(node, prevNode, coordinateCallback, data) {
            if(!node) {
                // This is either node.leftCoordinate or node.rightCoordinate
                var xy = coordinateCallback();
                var newNode = this.addAndDisplayNode(xy.cx, xy.cy, 20, ctx, data);
                line.draw(prevNode.getX(), prevNode.getY(), xy.cx, xy.cy, prevNode.getRadius(), ctx)
                return newNode; 
            } 
            else {
                if(data <= node.getData()) {
                node.left = this.recursiveAddNode(node.left, node, node.leftCoordinate, data);
                } 
                else {
                node.right = this.recursiveAddNode(node.right, node, node.rightCoordinate, data);
                }
                return node;
            }
        }
        
        // Adds the node to the tree and calls the draw function
        this.addAndDisplayNode = function(x, y, r, ctx, data) {
            var node = new Node(x, y, r, ctx, data);
            node.draw();
            return node;
        };
    };

    function drawTree() {
        btree = new BTree();
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        btree.add(8);
        btree.add(3);
        btree.add(10);
        btree.add(1);
        btree.add(6);
        btree.add(4);
        btree.add(7);
        btree.add(16);
    }

    window.clearTree = function() {
        drawTree();
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

    // Stack Class
    class Stack {
        constructor() { this.stack = [];}

        push(item) { this.stack.push(item);}

        pop() {
            if (this.isEmpty()) 
                return "Underflow"; 
            return this.stack.pop(); 
        }

        peek() { 
            // return the top most element from the stack 
            // but does'nt delete it. 
            return this.stack[this.stack.length - 1]; 
        } 

        isEmpty() { return this.stack.length == 0; } 
    }
    
    // Preforsm BFS on the tree
    window.bfs = function() {
        drawTree();
        bfs(btree.root);
    }
    async function bfs(tree) {
        if (!tree) {
            return;
        }
        Q = new Queue();
        Q.add(tree);
        while (!Q.isEmpty()) {
            await sleep(350);
            next_item = Q.remove();
            if (!next_item) {
                continue; 
            }            
            next_item.drawVisited();
            if (next_item.left) {
                await sleep(350);
                Q.add(next_item.left);
                next_item.left.drawSeen();
                
            }
            if (next_item.right) {
                await sleep(350);
                Q.add(next_item.right);
                next_item.right.drawSeen();
            }
        }
    }

    // Preforms DFS Inorder on the tree
    window.dfsInorder = function() {
        drawTree();
        dfsInorder(btree.root);
    }
    async function dfsInorder(tree) {
        curr = tree;
        stack = new Stack();
        done = 0;
        while (curr || !stack.isEmpty()) {
            while (curr) {
                await sleep(350);
                curr.drawSeen();
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            curr.drawVisited();
        
            curr = curr.right;
            await sleep(350);
        }
    }

    // Preforms DFS Preorder on the tree
    window.dfsPreorder = function() {
        drawTree();
        dfsPreorder(btree.root);
    }
    async function dfsPreorder(tree) {
        stack = new Stack();
        stack.push(tree);
        while (!stack.isEmpty()) {
            curr = stack.peek();
            curr.drawSeen();
            await sleep(350);
            curr.drawVisited();
            stack.pop();
            // Push right and left children of the popped node to stack 
            if (curr.right) { 
                await sleep(350);
                stack.push(curr.right); 
            } 
            if (curr.left) { 
                await sleep(350);
                stack.push(curr.left); 
            } 
        }
    }

    // Preforms DFS PostOrder on the tree
    window.dfsPostorder = function() {
        drawTree();
        dfsPostorder(btree.root);
    }
    async function dfsPostorder(tree) {
        stack = new Stack();
        if (!tree) 
            return
        stack.push(tree);
        tree.drawSeen();
        prev = null;
        while (!stack.isEmpty()) {
            await sleep(350);
            curr = stack.peek();
            if (prev == null || prev.left == curr || prev.right == curr) {
                if (curr.left) {
                    stack.push(curr.left);
                    curr.left.drawSeen();
                    await sleep(350);
                } else if (curr.right) {
                    stack.push(curr.right);
                    curr.right.drawSeen();
                    await sleep(350);
                } else {
                    var node = stack.pop();
                    node.drawVisited();
                    await sleep(350);
                }
            } else if (curr.left == prev) {
                if (curr.right) {
                    stack.push(curr.right);
                    curr.right.drawSeen();
                    await sleep(350);
                } else {
                    var node = stack.pop();
                    node.drawVisited();
                    await sleep(350);
                }
            } else if (curr.right == prev) {
                var node = stack.pop();
                node.drawVisited();
                await sleep(350);
            }
            prev = curr;
        }
        return;
    }

    // function to allow dealy for drawing on the screen for async function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    
    drawTree();
  });
  