ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {
		x: 8,
		y: 8
	},

	speed: 50,

	animSheet: new ig.AnimationSheet('media/player.png', 8, 8),

	init: function(x, y, settings) {
		// You should use different animations, but i'm to lazy ...
		this.addAnim('idle', 999999999999999999, [0, 1, 2, 3, 4, 5, 6, 7, 8]);

		this.parent(x, y, settings);
	},

	update: function() {
		if(ig.input.pressed('leftClick')) {
			// Get the obstacle in the middle
			var obstacles = ig.game.getEntitiesByType('EntityObstacle');

			for(var c = 0; c < obstacles.length; c++) {
				if(obstacles[c].pos.x == 224 && obstacles[c].pos.y == 128) {
					var exampleObstacle = obstacles[c];
				}
			}

			// Get the path
			this.getPath(ig.input.mouse.x + ig.game.screen.x, ig.input.mouse.y + ig.game.screen.y, true, ['EntityObstacle', 'EntityObstacle2', 'EntityObstacle3'], [exampleObstacle]);
		}

		if(ig.input.pressed('keyR')) {
			if(this.maxMovementActive) {
				this.maxMovementActive = false;

				this.directionChangeMalus45degree = ig.game.collisionMap.tilesize / 4;
				this.directionChangeMalus90degree = ig.game.collisionMap.tilesize * 5 / 8;
			} else {
				this.maxMovementActive = true;

				this.directionChangeMalus45degree = 0;
				this.directionChangeMalus90degree = 0;
			}
		}

		if(ig.input.state('keyF')) {
			if(this.maxMovement > 0) {
				this.maxMovement--;
			}
		}

		if(ig.input.state('keyG')) {
			this.maxMovement++;
		}

		// Walk the path
		this.followPath(this.speed, true);

		// Update the animation
		this.currentAnim.gotoFrame(this.headingDirection);

		// Heading direction values
		// 1 4 6
		// 2 0 7
		// 3 5 8
		this.parent();
	},

	draw: function() {
		// Attention this is important when you use the drawPath function or the entity doesn't show in weltmeister!
		if(!ig.global.wm) {
			// Draw the path ...
			this.drawPath(0, 255, 33, 0.5);

			if(this.maxMovementActive) {
				ig.game.font.draw('maxMovementActive   (r): true', 161, 1, ig.Font.ALIGN.LEFT);
			} else {
				ig.game.font.draw('maxMovementActive   (r): false', 161, 1, ig.Font.ALIGN.LEFT);
			}
			ig.game.font.draw('maxMovement      (f/g): ' + this.maxMovement, 161, 8, ig.Font.ALIGN.LEFT);
		}

		this.parent();
	}
});

});