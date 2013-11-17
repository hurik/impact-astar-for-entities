ig.module(
	'game.entities.obstacle2'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityObstacle2 = ig.Entity.extend({
	size: {
		x: 16,
		y: 8
	},

	animSheet: new ig.AnimationSheet('media/obstacle2.png', 16, 8),

	init: function(x, y, settings) {
		this.addAnim('idle', 999999999999999999, [0]);

		this.parent(x, y, settings);
	}
});

});