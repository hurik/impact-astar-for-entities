ig.module( 
    'game.main' 
)
.requires(
    'impact.game',

    'impact.debug.debug',
    'plugins.astar-for-entities-debug',

    'game.entities.player',

    'game.levels.example',

    'plugins.astar-for-entities'    
)
.defines(function(){

MyGame = ig.Game.extend({
    
    init: function() {
        ig.input.bind(ig.KEY.MOUSE1, 'leftClick');

        this.loadLevel(LevelExample);
    },

    update: function() {
        this.parent();
    }
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main('#canvas', MyGame, 60, 400, 200, 2);

});
