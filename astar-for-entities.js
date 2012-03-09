/**
* astar-for-entities
* https://github.com/hurik/impact-astar-for-entities
*
* v0.6.0
*
* Created by Andreas Giemza on 2012-03-09.
* Copyright (c) 2012 Andreas Giemza. All rights reserved.
*
* Based on: https://gist.github.com/994534
*           http://www.policyalmanac.org/games/aStarTutorial_de.html
*/

ig.module(
    'plugins.astar-for-entities'
)
.requires(
    'impact.entity'
).
defines(function() {

ig.Entity.inject({
    path: null,

    getPath: function(destinationX, destinationY) {
        // Get the map information
        var mapWidth = ig.game.collisionMap.width,
            mapHeight = ig.game.collisionMap.height,
            mapTilesize = ig.game.collisionMap.tilesize,
            map = ig.game.collisionMap.data;

        // Create the start and the destination as nodes
        var startNode = new asfeNode((this.pos.x / mapTilesize).floor(), (this.pos.y / mapTilesize).floor(), -1),
            destinationNode = new asfeNode((destinationX / mapTilesize).floor(), (destinationY / mapTilesize).floor(), -1);

        // Quick check if the destination tile is free
        if (map[destinationNode.y][destinationNode.x] != 0) {
            this.path = null;
            return;
        }

        // Check if the destination tile is not the start tile ...
        if (destinationNode.x == startNode.x && destinationNode.y == startNode.y) {
            this.path = null;
            return;
        }

        // Our two lists
        var open = [],
            closed = [];

        // The hash table for faster searching, if a tile already has a node
        var nodes = {};

        // Some variables we need later ...
        var bestCost, bestNode, currentNode, newX, newY, tempG, newNode;

        // Push the start node on the open list
        open.push(startNode);

        // And save it in the hash table
        nodes[startNode.x + ',' + startNode.y] = startNode;

        // Until the destination is found work off the open nodes
        while (open.length > 0) {
            // First find the best open node (smallest f value)
            bestCost = open[0].f;
            bestNode = 0;

            for (var i = 1; i < open.length; i++) {
                if (open[i].f < bestCost) {
                    bestCost = open[i].f;
                    bestNode = i;
                }
            }

            // The best open node is our currentNode
            currentNode = open[bestNode];

            // Check if we've reached our destination
            if (currentNode.x == destinationNode.x && currentNode.y == destinationNode.y) {
                // Add the destination to the path
                this.path = [{
                    x: destinationNode.x * mapTilesize,
                    y: destinationNode.y * mapTilesize
                }];

                // Go up the chain to recreate the path 
                while (true) {
                    currentNode = closed[currentNode.p];

                    // Stop when you get to the start node ...
                    if (currentNode.p == -1) {
                        return;
                    }

                    // Add the steps to the path
                    this.path.unshift({
                        x: currentNode.x * mapTilesize,
                        y: currentNode.y * mapTilesize
                    });
                }
            }

            // Erase the current node from the open list
            open.splice(bestNode, 1);

            // And add it to the closed list
            closed.push(currentNode);
            // Also set the indicator to closed
            currentNode.closed = true;

            // Now create all 8 neighbors of the node
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    // Don't check the parent node, which is in the middle
                    if (dx == 0 && dy == 0) {
                        continue;
                    }

                    newX = currentNode.x + dx;
                    newY = currentNode.y + dy;

                    // Check if the node is on the map
                    if (newX < 0 || newX >= mapWidth || newY < 0 || newY >= mapHeight) {
                        continue;
                    }

                    // Check if the tile is free
                    if (map[newY][newX] != 0) {
                        continue;
                    }

                    // Only use the upper left node, when both neighbor are not a wall
                    if (dx == -1 && dy == -1 && (map[currentNode.y - 1][currentNode.x] == 1 || map[currentNode.y][currentNode.x - 1] == 1)) {
                        continue;
                    }

                    // Only use the upper right node, when both neighbor are not a wall
                    if (dx == 1 && dy == -1 && (map[currentNode.y - 1][currentNode.x] == 1 || map[currentNode.y][currentNode.x + 1] == 1)) {
                        continue;
                    }

                    // Only use the lower left node, when both neighbor are not a wall
                    if (dx == -1 && dy == 1 && (map[currentNode.y][currentNode.x - 1] == 1 || map[currentNode.y + 1][currentNode.x] == 1)) {
                        continue;
                    }

                    // Only use the lower right node, when both neighbor are not a wall
                    if (dx == 1 && dy == 1 && (map[currentNode.y][currentNode.x + 1] == 1 || map[currentNode.y + 1][currentNode.x] == 1)) {
                        continue;
                    }

                    // Check if this tile already has a node
                    if (nodes[newX + ',' + newY]) {
                        // When the node is closed continue
                        if (nodes[newX + ',' + newY].closed) {
                            continue;
                        }

                        // Calculate the g value
                        if ((dx == -1 && dy == -1) || (dx == 1 && dy == -1) || (dx == -1 && dy == 1) || (dx == 1 && dy == 1)) {
                            tempG = currentNode.g + 14;
                        } else {
                            tempG = currentNode.g + 10;
                        }

                        // If it is smaller than the g value in the existing node update the node
                        if (tempG < nodes[newX + ',' + newY].g) {
                            nodes[newX + ',' + newY].g = tempG;
                            nodes[newX + ',' + newY].f = tempG + nodes[newX + ',' + newY].h;
                            nodes[newX + ',' + newY].p = closed.length - 1;
                        }

                        continue;
                    }

                    // After this thousand checks we create an new node
                    newNode = new asfeNode(newX, newY, closed.length - 1);
                    // Put it on the hash list
                    nodes[newNode.x + ',' + newNode.y] = newNode;

                    // Fill it with values
                    if ((dx == -1 && dy == -1) || (dx == 1 && dy == -1) || (dx == -1 && dy == 1) || (dx == 1 && dy == 1)) {
                        newNode.g = currentNode.g + 14;
                    } else {
                        newNode.g = currentNode.g + 10;
                    }
                    newNode.h = 10 * Math.sqrt(Math.pow(newNode.x - destinationNode.x, 2) + Math.pow(newNode.y - destinationNode.y, 2));
                    newNode.f = newNode.g + newNode.h;

                    // And push it on the open list ...
                    open.push(newNode);
                }

            }

        }

        // No path found ...
        this.path = null;
    },

    followPath: function(speed) {
        // Only do something if there is a path ...
        if (this.path) {
            // Did we reached a waypoint?
            if (((this.pos.x >= this.path[0].x && this.last.x < this.path[0].x) || (this.pos.x <= this.path[0].x && this.last.x > this.path[0].x) || this.pos.x == this.path[0].x) && 
                ((this.pos.y >= this.path[0].y && this.last.y < this.path[0].y) || (this.pos.y <= this.path[0].y && this.last.y > this.path[0].y) || this.pos.y == this.path[0].y)) {
                // Was it the last waypoint?
                if (this.path.length == 1) {
                    // Stopp the movement and set the position
                    this.vel.x = 0;
                    this.pos.x = this.path[0].x;
                    this.vel.y = 0;
                    this.pos.y = this.path[0].y;
                }

                // Erase the last waypoint
                this.path.splice(0, 1);

                // if it was the last nothing to do ...
                if (!this.path.length) {
                    this.path = null;
                    return;
                }
            }

            // Calculate the speed if we move diagonal
            if (this.pos.x != this.path[0].x && this.pos.y != this.path[0].y) {
                speed = Math.sqrt(Math.pow(speed, 2) / 2);
            }

            // Move it in the right direction ...
            if ((this.pos.x >= this.path[0].x && this.last.x < this.path[0].x) || (this.pos.x <= this.path[0].x && this.last.x > this.path[0].x)) {
                this.vel.x = 0;
                this.pos.x = this.path[0].x;
            } else if (this.pos.x < this.path[0].x) {
                this.vel.x = speed;
            } else if (this.pos.x > this.path[0].x) {
                this.vel.x = -speed;
            }

            if ((this.pos.y >= this.path[0].y && this.last.y < this.path[0].y) || (this.pos.y <= this.path[0].y && this.last.y > this.path[0].y)) {
                this.vel.y = 0;
                this.pos.y = this.path[0].y;
            } else if (this.pos.y < this.path[0].y) {
                this.vel.y = speed;
            } else if (this.pos.y > this.path[0].y) {
                this.vel.y = -speed;
            }
        } else {
            // When there is no path, don't move ...
            this.vel.x = 0;
            this.vel.y = 0;
        }
    }
});

asfeNode = function(x, y, p) {
    // Coordinates
    this.x = x;
    this.y = y;
    // Parent
    this.p = p;
    // G, H and F
    this.g = 0;
    this.h = 0;
    this.f = 0;
    // Closed indicator
    this.closed = false;
};

});