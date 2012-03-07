/**
* astar-for-entities
*
* Created by Andreas Giemza on 2012-03-07.
* Copyright (c) 2012 Andreas Giemza. All rights reserved.
*
* Based on: https://gist.github.com/994534
*           http://www.policyalmanac.org/games/aStarTutorial_de.html
*/

ig.module( 
    'plugins.astar-for-entities-debug' 
)
.requires(
    'impact.debug.menu',
    'impact.entity'
)
.defines(function(){

ig.Entity.inject({
    draw: function() {
        this.parent();

        if (ig.Entity._debugShowPaths) {
            // When there is a path draw it ...
            if (this.path) {
                ig.system.context.strokeStyle = 'rgba(255,0,0,0.5)';
                ig.system.context.lineWidth = 4.0;

                ig.system.context.beginPath();

                ig.system.context.moveTo(
                ig.system.getDrawPos(this.path[0].x + ig.game.collisionMap.tilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.path[0].y + ig.game.collisionMap.tilesize / 2 - ig.game.screen.y));


                for (var i = 1; i < this.path.length; i++) {
                    ig.system.context.lineTo(
                    ig.system.getDrawPos(this.path[i].x + ig.game.collisionMap.tilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.path[i].y + ig.game.collisionMap.tilesize / 2 - ig.game.screen.y));
                }

                ig.system.context.stroke();
                ig.system.context.closePath();
            }
        }
    }
});

ig.Entity._debugShowPaths = false;

ig.debug.addPanel({
    type: ig.DebugPanel,
    name: 'astar-for-entities-debug',
    label: 'A*',

    options: [
        {
            name: 'Show paths',
            object: ig.Entity,
            property: '_debugShowPaths'
        }
    ]
});

});