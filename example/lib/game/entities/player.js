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
		}

		this.parent();
	}
});

});