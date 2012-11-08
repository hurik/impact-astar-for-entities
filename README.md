# Impact A* for Entities

## Information
This plugin for the [Impact Game Engine](http://impactjs.com/) adds pathfinding to the entities. It also has a basic path following function, a example for path drawing function and a debug panel for showing the path of all entities.

Since version 1.0.0 it also can take also entity types into his calculation. But it is only realy working for fixed entities!

More information in the [Impact Game Engine Forum](http://impactjs.com/forums/): http://impactjs.com/forums/code/a-path-finder


## Usage
Check the example/lib/game/game.js, example/lib/game/entities/player.js, example/lib/game/entities/enemy.js and example/lib/game/entities/enemy2.js!

### Info for the entityTypesArray and ignoreEntityArray options
#### entityTypesArray
It is an array! It wants the entity type as string! Example: ['EntityPlayer', 'EntityEnemy', ...]

#### ignoreEntityArray
Also an array! It wants references of the entity! Example: [this, enemey[0], ...]


## Live demo
Check out: [http://www.hurik.de/impact-astar-for-entities/](http://www.hurik.de/impact-astar-for-entities/)

### Info
* The green player is contoled by clicking on the maps. It can't go through the obstacles, except the one in the middle. Check the player.js how it works ...
* The red enemy follows the player. Every 2 seconds it calculates the path to the player. It cannot pass every obstacle. Check the enemy.js how it works ...
* The blue enemy follows the player. Every 4 seconds his path is updated. It can pass the obstacles and it cannot move diagonal. Check the enemy2.js how it works ...


## Example
To change the level or work with the code, add in example folder the missing libary files and folders:
```
lib/weltmeister/
lib/impact/
tools/
index.htmlw
weltmeister.html
```

## Example images
![Oldest Example](/hurik/impact-astar-for-entities/raw/master/example.png)


## TODO
* A* search algorithm (getPath)
	* Make it faster
	* Add coordinated movement (For the future ...)
* path following (followPath)
	* Very much room for improvments ...


## Changelog
### v1.0.0
* path following
	* Entity support
* General
	* Readme improved
	* Example highly improved

#### v0.9.4
* path following
	* alignOnNearestTile option was added: If the path was erased before the entity has gotten to his destination and stands between two tiles, this little check will adlign it on the nearest tile

#### v0.9.3
* A* search algorithm
	* If diagonal movement is deactivated, it uses the manhattan distance heuristic
* path following
	* Heading direction is now saved in the headingDirection variable, for more information check the example

#### v0.9.2
* A* search algorithm
	* Now using the diagonal distance heuristic
	* Added seperate maluses for 45 degress an 90 degree direction changes, still testing for good values for the maluses
* General
	* Converted indentation to tabs

#### v0.9.1
* A* search algorithm
	* No it is possible to deactivate diagonal movement (Example: getPath(destinationX, destinationY, false), default is true!) 
	* The check for not cutting edges was improved
	* Small G and H calculation changes

### v0.9.0
* A* search algorithm
	* Added malus for direction change -> now nicer paths
* General
	* Added new example image to explain the direction change malus
	* Example demo updated the new code
	* Readme improved

#### v0.8.3
* A* search algorithm
	* Path now only saves the nodes, when the walking direction changed (Much less path points)
* path drawing
	* Because the new path save style, its now a line, like in the debug
* General
	* Example image changed

#### v0.8.2
* General
	* Example image changed
	* Readme improved

#### v0.8.1
* General
	* Little example demo update

### v0.8.0
* General
	* Added example

### v0.7.0
* A* search algorithm
	* Now calculates the real distances, working with even numbers wasn't faster
* path drawing
	* Basic function added, only as an example for a possible implematation

### v0.6.0
* A* search algorithm
	* Checks now for walkable tiles and not for walls, no more problems with slopes anymore 
* path following
	* Added entity movement stop when there is no path
	* No rounding anymore for diagonal movments speed calculation (Doesn't impact the framerate)

#### v0.5.2
* path following
	* followPath now really working, but still far from perfect ...

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