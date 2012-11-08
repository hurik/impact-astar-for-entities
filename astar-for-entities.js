/*
 * astar-for-entities
 * https://github.com/hurik/impact-astar-for-entities
 *
 * v1.0.0
 *
 * Andreas Giemza
 * andreas@giemza.net
 * http://www.hurik.de/
 *
 * This work is licensed under the Creative Commons Attribution 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/.
 *
 * Thanks to: Joncom and FabienM (http://impactjs.com/forums/code/a-path-finder)
 *
 * Based on : https://gist.github.com/994534
 *            http://www.policyalmanac.org/games/aStarTutorial_de.html
 *            http://theory.stanford.edu/~amitp/GameProgramming/index.html
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
	headingDirection: 0,
	// Heading direction values
	// 1 4 6
	// 2 0 7
	// 3 5 8
	
	getPath: function(destinationX, destinationY, diagonalMovement, entityTypesArray, ignoreEntityArray) {
		if(diagonalMovement == null) {
			diagonalMovement = true;
		}

		if (entityTypesArray == null) {
			entityTypesArray = [];
		}
		
		if (ignoreEntityArray == null) {
			ignoreEntityArray = [];
		}

		// Get the map information
		var mapWidth = ig.game.collisionMap.width,
			mapHeight = ig.game.collisionMap.height,
			mapTilesize = ig.game.collisionMap.tilesize,
			map = ig.game.collisionMap.data,
			// Direction change maluses
			directionChangeMalus45degree = 2,
			directionChangeMalus90degree = 5,
			// Diagonal movement costs
			diagonalMovementCosts = Math.sqrt(2);

		this.getPathAddEraseEntities(true, entityTypesArray, ignoreEntityArray);

		// Create the start and the destination as nodes
		var startNode = new asfeNode((this.pos.x / mapTilesize).floor(), (this.pos.y / mapTilesize).floor(), -1, 0),
			destinationNode = new asfeNode((destinationX / mapTilesize).floor(), (destinationY / mapTilesize).floor(), -1, 0);

		// Check if the destination tile is not the start tile ...
		if(destinationNode.x == startNode.x && destinationNode.y == startNode.y) {
			this.path = null;
			return;
		}

		// Add the entities to the collision map
		this.getPathAddEraseEntities(true, entityTypesArray, ignoreEntityArray);

		// Quick check if the destination tile is free
		if(map[destinationNode.y][destinationNode.x] != 0) {
			this.path = null;

			// Erase the entities from the collision map						
			this.getPathAddEraseEntities(false, entityTypesArray, ignoreEntityArray);

			return;
		}

		// Our two lists
		var open = [],
			closed = [];

		// The hash table for faster searching, if a tile already has a node
		var nodes = {};

		// Some variables we need later ...
		var bestCost, bestNode, currentNode, newX, newY, tempG, newNode, lastDirection, direction;

		// Push the start node on the open list
		open.push(startNode);

		// And save it in the hash table
		nodes[startNode.x + ',' + startNode.y] = startNode;

		// Until the destination is found work off the open nodes
		while(open.length > 0) {
			// First find the best open node (smallest f value)
			bestCost = open[0].f;
			bestNode = 0;

			for(var i = 1; i < open.length; i++) {
				if(open[i].f < bestCost) {
					bestCost = open[i].f;
					bestNode = i;
				}
			}

			// The best open node is our currentNode
			currentNode = open[bestNode];

			// Check if we've reached our destination
			if(currentNode.x == destinationNode.x && currentNode.y == destinationNode.y) {
				// Add the destination to the path
				this.path = [{
					x: destinationNode.x * mapTilesize,
					y: destinationNode.y * mapTilesize
				}];

				// direction
				// 0 stand for X and Y change
				// 1 stands for X change
				// 2 stand for Y change
				// Get the direction
				if(currentNode.x != closed[currentNode.p].x && currentNode.y != closed[currentNode.p].y) {
					lastDirection = 0;
				} else if(currentNode.x != closed[currentNode.p].x && currentNode.y == closed[currentNode.p].y) {
					lastDirection = 1;
				} else if(currentNode.x == closed[currentNode.p].x && currentNode.y != closed[currentNode.p].y) {
					lastDirection = 2;
				}

				// Go up the chain to recreate the path 
				while(true) {
					currentNode = closed[currentNode.p];

					// Stop when you get to the start node ...
					if(currentNode.p == -1) {
						// Erase the entities from the collision map						
						this.getPathAddEraseEntities(false, entityTypesArray, ignoreEntityArray);
						
						return;
					}

					// Get the direction
					if(currentNode.x != closed[currentNode.p].x && currentNode.y != closed[currentNode.p].y) {
						direction = 0;
					} else if(currentNode.x != closed[currentNode.p].x && currentNode.y == closed[currentNode.p].y) {
						direction = 1;
					} else if(currentNode.x == closed[currentNode.p].x && currentNode.y != closed[currentNode.p].y) {
						direction = 2;
					}

					// Only save the path node, if the path changes the direction
					if(direction != lastDirection) {
						// Add the steps to the path
						this.path.unshift({
							x: currentNode.x * mapTilesize,
							y: currentNode.y * mapTilesize
						});
					}

					lastDirection = direction;
				}
			}

			// Erase the current node from the open list
			open.splice(bestNode, 1);

			// And add it to the closed list
			closed.push(currentNode);
			// Also set the indicator to closed
			currentNode.closed = true;

			// Directions
			// 1 4 6
			// 2 X 7
			// 3 5 8
			// 0 is ignored for start and end node
			direction = 0;

			// Now create all 8 neighbors of the node
			for(var dx = -1; dx <= 1; dx++) {
				for(var dy = -1; dy <= 1; dy++) {
					if(!diagonalMovement) {
						// Skips checking of diagonals, when diagonalMovement is false
						if(Math.abs(dx) == Math.abs(dy)) {
							continue;
						}
					}

					// Don't check the parent node, which is in the middle
					if(dx == 0 && dy == 0) {
						continue;
					}

					direction++;

					newX = currentNode.x + dx;
					newY = currentNode.y + dy;

					// Check if the node is on the map
					if(newX < 0 || newX >= mapWidth || newY < 0 || newY >= mapHeight) {
						continue;
					}

					// Check if the tile is free
					if(map[newY][newX] != 0) {
						continue;
					}

					// Only use the upper left node, when both neighbor are not a wall
					if(dx == -1 && dy == -1 && (map[currentNode.y - 1][currentNode.x] != 0 || map[currentNode.y][currentNode.x - 1] != 0)) {
						continue;
					}

					// Only use the upper right node, when both neighbor are not a wall
					if(dx == 1 && dy == -1 && (map[currentNode.y - 1][currentNode.x] != 0 || map[currentNode.y][currentNode.x + 1] != 0)) {
						continue;
					}

					// Only use the lower left node, when both neighbor are not a wall
					if(dx == -1 && dy == 1 && (map[currentNode.y][currentNode.x - 1] != 0 || map[currentNode.y + 1][currentNode.x] != 0)) {
						continue;
					}

					// Only use the lower right node, when both neighbor are not a wall
					if(dx == 1 && dy == 1 && (map[currentNode.y][currentNode.x + 1] != 0 || map[currentNode.y + 1][currentNode.x] != 0)) {
						continue;
					}

					// Check if this tile already has a node
					if(nodes[newX + ',' + newY]) {
						// When the node is closed continue
						if(nodes[newX + ',' + newY].closed) {
							continue;
						}

						// Calculate the g value
						tempG = currentNode.g + Math.sqrt(Math.pow(newX - currentNode.x, 2) + Math.pow(newY - currentNode.y, 2));

						// When the direction changed
						if(currentNode.d != direction) {
							if(currentNode.d == 1 && (direction == 2 || direction == 4)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 2 && (direction == 1 || direction == 3)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 3 && (direction == 2 || direction == 5)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 4 && (direction == 1 || direction == 6)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 5 && (direction == 3 || direction == 8)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 6 && (direction == 4 || direction == 7)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 7 && (direction == 6 || direction == 8)) {
								tempG = tempG + directionChangeMalus45degree;
							} else if(currentNode.d == 8 && (direction == 5 || direction == 7)) {
								tempG = tempG + directionChangeMalus45degree;
							} else {
								tempG = tempG + directionChangeMalus90degree;
							}
						}

						// If it is smaller than the g value in the existing node, update the node
						if(tempG < nodes[newX + ',' + newY].g) {
							nodes[newX + ',' + newY].g = tempG;
							nodes[newX + ',' + newY].f = tempG + nodes[newX + ',' + newY].h;
							nodes[newX + ',' + newY].p = closed.length - 1;
							nodes[newX + ',' + newY].d = direction;
						}

						continue;
					}

					// After this thousand checks we create an new node
					newNode = new asfeNode(newX, newY, closed.length - 1, direction);
					// Put it on the hash list
					nodes[newNode.x + ',' + newNode.y] = newNode;

					// Fill it with values
					newNode.g = currentNode.g + Math.sqrt(Math.pow(newNode.x - currentNode.x, 2) + Math.pow(newNode.y - currentNode.y, 2));

					// When the direction changed
					if(currentNode.d != newNode.d && currentNode.d != 0) {
						if(currentNode.d == 1 && (newNode.d == 2 || newNode.d == 4)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 2 && (newNode.d == 1 || newNode.d == 3)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 3 && (newNode.d == 2 || newNode.d == 5)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 4 && (newNode.d == 1 || newNode.d == 6)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 5 && (newNode.d == 3 || newNode.d == 8)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 6 && (newNode.d == 4 || newNode.d == 7)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 7 && (newNode.d == 6 || newNode.d == 8)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else if(currentNode.d == 8 && (newNode.d == 5 || newNode.d == 7)) {
							newNode.g = newNode.g + directionChangeMalus45degree;
						} else {
							newNode.g = newNode.g + directionChangeMalus90degree;
						}
					}

					// If diagonalMovement is true, we use the diagonal distance heuristic
					if(diagonalMovement) {
						var h_diagonal = Math.min(Math.abs(newNode.x - destinationNode.x), Math.abs(newNode.y - destinationNode.y));
						var h_straight = Math.abs(newNode.x - destinationNode.x) + Math.abs(newNode.y - destinationNode.y);

						newNode.h = (diagonalMovementCosts * h_diagonal) + (h_straight - (2 * h_diagonal));
					} else {
						// If it is false, we use the manhattan distance heuristic
						newNode.h = Math.abs(newNode.x - destinationNode.x) + Math.abs(newNode.y - destinationNode.y);
					}

					newNode.f = newNode.g + newNode.h;

					// And push it on the open list ...
					open.push(newNode);
				}
			}
		}

		// No path found ...
		this.path = null;
		
		// Erase the entities from the collision map	
		this.getPathAddEraseEntities(false, entityTypesArray, ignoreEntityArray);

		return;
	},

	getPathAddEraseEntities: function(addErase, entityTypesArray, ignoreEntityArray) {
		var ignoreThisEntity;

		// Add or erase the entity types to the collision map
		// Go through the entityTypesArray
		for(i = 0; i < entityTypesArray.length; i++) {
			var entities = ig.game.getEntitiesByType(entityTypesArray[i]);

			// Get every entity of this type
			for(j = 0; j < entities.length; j++) {
				ignoreThisEntity = false;

				// Check if it is excludes from the the check
				for(k = 0; k < ignoreEntityArray.length; k++) {
					if(ignoreEntityArray[k].id == entities[j].id) {
						ignoreThisEntity = true;
					}
				}

				// Add or erase the entity to the collision map
				if(!ignoreThisEntity) {
					if(addErase && ig.game.collisionMap.data[(entities[j].pos.y/ ig.game.collisionMap.tilesize).floor()][(entities[j].pos.x/ ig.game.collisionMap.tilesize).floor()] == 0) {
						ig.game.collisionMap.data[(entities[j].pos.y/ ig.game.collisionMap.tilesize).floor()][(entities[j].pos.x/ ig.game.collisionMap.tilesize).floor()] = 9999;
					} else if (!addErase && ig.game.collisionMap.data[(entities[j].pos.y/ ig.game.collisionMap.tilesize).floor()][(entities[j].pos.x/ ig.game.collisionMap.tilesize).floor()] == 9999) {
						ig.game.collisionMap.data[(entities[j].pos.y/ ig.game.collisionMap.tilesize).floor()][(entities[j].pos.x/ ig.game.collisionMap.tilesize).floor()] = 0;
					}
				}
			}
		}
	},
	

	followPath: function(speed, alignOnNearestTile) {
		if(alignOnNearestTile == null) {
			alignOnNearestTile = false;
		}

		// If the path was erased before the entity has gotten to his destination and stands between two tiles, this little check will adlign on nearest tile
		if(!this.path && alignOnNearestTile) {
			// Get the coordinates of the current tile
			var cx = (this.pos.x / ig.game.collisionMap.tilesize).floor() * ig.game.collisionMap.tilesize,
				cy = (this.pos.y / ig.game.collisionMap.tilesize).floor() * ig.game.collisionMap.tilesize;

			// Check if our entity is align on it
			if(cx != this.pos.x || cy != this.pos.y) {
				// Get the x dinstance to the current tile
				var dx = this.pos.x - cx,
					dy = this.pos.y - cy;

				// Get the y distance to the next tile
				var dxp = cx + ig.game.collisionMap.tilesize - this.pos.x,
					dyp = cy + ig.game.collisionMap.tilesize - this.pos.y;

				// Choose the smaller distance
				if (dx < dxp) {
					var tx = cx;
				} else {
					var tx = cx + ig.game.collisionMap.tilesize;
				}

				if (dy < dyp) {
					var ty = cy;
				} else {
					var ty = cy + ig.game.collisionMap.tilesize;
				}

				// Add it to the path
				this.path = [{
					x: tx,
					y: ty
				}];
			}
		}

		// Only do something if there is a path ...
		if(this.path) {
			// Did we reached a waypoint?
			if(((this.pos.x >= this.path[0].x && this.last.x < this.path[0].x) || (this.pos.x <= this.path[0].x && this.last.x > this.path[0].x) || this.pos.x == this.path[0].x) && ((this.pos.y >= this.path[0].y && this.last.y < this.path[0].y) || (this.pos.y <= this.path[0].y && this.last.y > this.path[0].y) || this.pos.y == this.path[0].y)) {
				// Was it the last waypoint?
				if(this.path.length == 1) {
					// Stopp the movement and set the position
					this.vel.x = 0;
					this.pos.x = this.path[0].x;
					this.vel.y = 0;
					this.pos.y = this.path[0].y;
				}

				// Erase the last waypoint
				this.path.splice(0, 1);

				// if it was the last nothing to do ...
				if(!this.path.length) {
					this.path = null;
					return;
				}
			}

			// Calculate the speed if we move diagonal
			if(this.pos.x != this.path[0].x && this.pos.y != this.path[0].y) {
				speed = Math.sqrt(Math.pow(speed, 2) / 2);
			}

			// Move it in the right direction ...
			if((this.pos.x >= this.path[0].x && this.last.x < this.path[0].x) || (this.pos.x <= this.path[0].x && this.last.x > this.path[0].x)) {
				this.vel.x = 0;
				this.pos.x = this.path[0].x;
			} else if(this.pos.x < this.path[0].x) {
				this.vel.x = speed;
			} else if(this.pos.x > this.path[0].x) {
				this.vel.x = -speed;
			}

			if((this.pos.y >= this.path[0].y && this.last.y < this.path[0].y) || (this.pos.y <= this.path[0].y && this.last.y > this.path[0].y)) {
				this.vel.y = 0;
				this.pos.y = this.path[0].y;
			} else if(this.pos.y < this.path[0].y) {
				this.vel.y = speed;
			} else if(this.pos.y > this.path[0].y) {
				this.vel.y = -speed;
			}

			// Get the heading direction
			if(this.vel.x < 0 && this.vel.y < 0) {
				this.headingDirection = 1;
			} else if(this.vel.x < 0 && this.vel.y > 0) {
				this.headingDirection = 3;
			} else if(this.vel.x > 0 && this.vel.y < 0) {
				this.headingDirection = 6;
			} else if(this.vel.x > 0 && this.vel.y > 0) {
				this.headingDirection = 8;
			} else if(this.vel.x < 0) {
				this.headingDirection = 2;
			} else if(this.vel.x > 0) {
				this.headingDirection = 7;
			} else if(this.vel.y < 0) {
				this.headingDirection = 4;
			} else if(this.vel.y > 0) {
				this.headingDirection = 5;
			}
		} else {
			// When there is no path, don't move ...
			this.vel.x = 0;
			this.vel.y = 0;

			this.headingDirection = 0;
		}
	},

	drawPath: function(r, g, b, a, lineWidth) {
		if(this.path) {
			var mapTilesize = ig.game.collisionMap.tilesize;

			ig.system.context.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
			ig.system.context.lineWidth = lineWidth * ig.system.scale;

			ig.system.context.beginPath();

			ig.system.context.moveTo(
			ig.system.getDrawPos(this.pos.x + this.size.x / 2 - ig.game.screen.x), ig.system.getDrawPos(this.pos.y + this.size.y / 2 - ig.game.screen.y));

			for(var i = 0; i < this.path.length; i++) {
				ig.system.context.lineTo(
				ig.system.getDrawPos(this.path[i].x + mapTilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.path[i].y + mapTilesize / 2 - ig.game.screen.y));
			}

			ig.system.context.stroke();
			ig.system.context.closePath();
		}
	}
});

asfeNode = function(x, y, p, d) {
	// Coordinates
	this.x = x;
	this.y = y;
	// Parent
	this.p = p;
	// Direction
	this.d = d;
	// G, H and F
	this.g = 0;
	this.h = 0;
	this.f = 0;
	// Closed indicator
	this.closed = false;
};

});