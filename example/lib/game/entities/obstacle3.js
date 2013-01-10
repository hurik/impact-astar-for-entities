ig.module(
	'game.entities.obstacle3'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityObstacle3 = ig.Entity.extend({
	size: {
		x: 16,
		y: 32
	},

	animSheet: new ig.AnimationSheet('media/obstacle3.png', 16, 32),

	init: function(x, y, settings) {
		this.addAnim('idle', 999999999999999999, [0]);

		this.parent(x, y, settings);
	}
});

});