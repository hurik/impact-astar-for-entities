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
    
    // Activate nicerPath!
    nicerPath: true,

    init: function(x, y, settings) {
        // You should use different animations, but i'm to lazy ...
        this.addAnim('idle', 999999999999999999, [0]);

        this.parent(x, y, settings);
    },

    update: function() {
        if(ig.input.pressed('leftClick')) {
            // Get the path
            this.getPath(ig.input.mouse.x + ig.game.screen.x, ig.input.mouse.y + ig.game.screen.y, true);
        }

        // Walk the path
        this.followPath(this.speed, true);

        this.parent();
    }
});

});