# Impact A* for Entities

## Information
This plugin for the [Impact Game Engine](http://impactjs.com/) and added pathfinding to the entities. It also has a basic path following function, a example for path drawing function and a debug panel for showing the path of all entities. 

More information in the [Impact Game Engine Forum](http://impactjs.com/forums/): http://impactjs.com/forums/code/a-path-finder


## Usage
Check the example/lib/game/game.js and example/lib/game/entities/player.js!


## Demo
Check out: [http://www.hurik.de/impact-astar-for-entities/](http://www.hurik.de/impact-astar-for-entities/)


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
#### New algorithm with different direction change malus for 45 degree and 90 degree
![New example](/hurik/impact-astar-for-entities/raw/master/example_with_90degree_malus.png)

15 direction changes but two 90 degree changes less

#### Old algorithm with direction change malus
![Old example](/hurik/impact-astar-for-entities/raw/master/example_with_malus.png)

14 direction changes

#### First algorithm without direction change malus
![Oldest Example](/hurik/impact-astar-for-entities/raw/master/example.png)

22 direction changes (8 more!)


## TODO
* A* search algorithm (getPath)
	* Make it faster
	* Add coordinated movement (For the future ...)
* path following (followPath) (!!! Experimental !!!)
	* Very much room for improvments ...


## Changelog
#### v0.9.3
* path following
	* alignOnNearestTile option was added: If the path was erased before the entity has gotten to his destination and stands between two tiles, this little check will adlign it on the nearest tile

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