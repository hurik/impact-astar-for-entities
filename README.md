# Impact A* for Entities

## Information
Too lazy ...
http://impactjs.com/forums/code/a-path-finder

## Example
![Example](/hurik/impact-astar-for-entities/raw/master/example.png)

## TODO
* A* search algorithm (getPath)
    * Make it faster
    * Optimize it for nicer paths
* path following (followPath) (!!! Experimental !!!)
    * Very much room for improvments ...
* path drawing (drawPath)
    * Is only a example for one implementation

## Changelog
### v0.7.0
* A* search algorithm
    * Now calculates the real distances, working with even numbers wasn't faster
* path drawing
    * Basic function added, only a example

### v0.6.0
* A* search algorithm
    * Checks now for walkable tiles and not for walls, no more problems with slopes anymore 
* path following
    * Added entity movement stop when there is no path
    * No rounding anymore for diagonal movments speed calculation

#### v0.5.2
* path following
    * followPath now really working, but far from perfect ...

#### v0.5.1
* path following
    * followPath working for low framrates but FAR from a good implementation

### v0.5.0
* General
    * Added version numbering
    * New example image
* A* search algorithm
    * The start tile of the entity is not anymore a part of the path
* path following
    * Added followPath(speed) function (Experimental at the moment, low framerates not working ...)
* Debug
    * Startpoint of the 'show paths' debug feature is now the middle of the entity