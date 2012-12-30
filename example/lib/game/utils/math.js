/*
pulling a lot of this math stuff from all over the internet... sources listed below when I remember to add them.
https://github.com/mysterioustrousers/MTGeometry/blob/master/MTGeometry/MTGeometry.c
*/

ig.module(
    'game.utils.math'
)
    .defines(function () {

        MathUtil = ig.Class.extend({

            init: function () {

                var self = this;

                //var newPoint = self.getPointSomeDistanceFromStart({ x: 0, y: 0 }, { x: 10, y: 0 }, 5);
                //console.log('newPoint (should be x:5, y:0)', newPoint);
                //var newPoint2 = self.getPointSomeDistanceFromStartTake2({ x: 0, y: 0 }, { x: 10, y: 0 }, 5);
                //console.log('newPoint2 (should be x:5, y:0', newPoint2);

            },

            distanceTo: function (p1, p2) {
                var distSquared = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
                return distSquared;
            },

            getPointSomeDistanceFromStart: function (startPos, endPos, distanceFromStart) {
                var self = this;
                var totalDistance = self.distanceTo(startPos, endPos);
                var totalDelta = { x: endPos.x - startPos.x, y: endPos.y - startPos.y };
                var percent = distanceFromStart / totalDistance;
                var delta = { x: totalDelta.x * percent, y: totalDelta.y * percent };
                return { x: startPos.x + delta.x, y: startPos.y + delta.y };
            },

        });
    });