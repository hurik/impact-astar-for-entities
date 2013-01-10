ig.module(
	'game.entities.enemy2'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEnemy2 = ig.Entity.extend({
	size: {
		x: 8,
		y: 8
	},

	speed: 30,

	pathTimer: null,

	animSheet: new ig.AnimationSheet('media/enemy2.png', 8, 8),

	init: function(x, y, settings) {
		// You should use different animations, but i'm to lazy ...
		this.addAnim('idle', 999999999999999999, [0, 1, 2, 3, 4, 5, 6, 7, 8]);

		this.pathTimer = new ig.Timer(4);

		this.parent(x, y, settings);
	},

	update: function() {
		// Update it every 4 seconds
		if(this.pathTimer.delta() > 0) {
			// Get the path to the player
			this.getPath(ig.game.player.pos.x, ig.game.player.pos.y, false);

			this.pathTimer.reset();
		}

		// Walk the path
		this.followPath(this.speed);

		// Update the animation
		this.currentAnim.gotoFrame(this.headingDirection);

		// Heading direction values
		// 1 4 6
		// 2 0 7
		// 3 5 8
		this.parent();
	},

	draw: function() {
		if(!ig.global.wm) {
			// Draw the path ...
			this.drawPath(0, 38, 255, 0.5);
		}

		this.parent();
	}
});

});