ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.ACTIVE,

	size: {
		x: 8,
		y: 8
	},

	speed: 50,

	animSheet: new ig.AnimationSheet('media/player.png', 8, 8),

	init: function(x, y, settings) {
		this.addAnim('idle', 5, [0]);

		this.parent(x, y, settings);
	},

	update: function() {
		if (ig.input.pressed('leftClick')) {
			var runtimeStart = new Date();
			this.getPath(ig.input.mouse.x + ig.game.screen.x, ig.input.mouse.y + ig.game.screen.y);
			var runtimeEnd = new Date();
			ig.log('getPath runtime: ' + (runtimeEnd - runtimeStart));
		}

		this.followPath(this.speed);

		this.parent();
	},

	draw: function() {
		if (!ig.global.wm) {
			this.drawPath(0, 255, 33, 0.5);
		}

		this.parent();
	}
});

});