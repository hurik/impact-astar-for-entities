# Impact A* for Entities

## Information
This plugin for the [Impact Game Engine](http://impactjs.com/) adds pathfinding to the entities. It also has a basic path following function, a example for path drawing function and a debug panel for showing the path of all entities.

Since version 1.0.0 it also can take entity types into his calculation. But it is only really working for fixed obstacles.

**Attention:**
* The entities must be aligned with a tile and
* the size must be an multiple if the tilesize.

More information in the [Impact Game Engine Forum](http://impactjs.com/forums/): http://impactjs.com/forums/code/a-path-finder

It would be very nice when you inform me, with an short email, when you are using this plugin in a project.


## Usage
Check the `example/lib/game/main.js`, `example/lib/game/entities/player.js`, `example/lib/game/entities/enemy.js` and `example/lib/game/entities/enemy2.js`!

**getPath(destinationX, destinationY, diagonalMovement, entityTypesArray, ignoreEntityArray)**

Calculates the path and the the result will be saved in `this.path`.

Since version 1.2.0 you also can activate the max movement with `this.maxMovementActive`. The length of the path can be modified with `this.maxMovement`. But you should deactivate the `this.directionChangeMalus45degree` and `this.directionChangeMalus90degree` maluses (Set them to zero ...) to prevent strange paths. Check the `example/lib/game/entities/player.js` for more information ...

* **destinationX and destinationY:** The destination ...
* **diagonalMovement:** If true diagonal movement is activated (Default) and when false it isn't.
* **entityTypesArray:** It is an array! It wants the entity type as string! Example: ['EntityPlayer', 'EntityEnemy', ...]
* **ignoreEntityArray:** Also an array! It wants references of the entities you want to exclude from the including into the collision map! Example: [this, enemy[0], ...]

**followPath(speed, alignOnNearestTile)**

Follows the calculated path. The current heading direction will be saved in `this.headingDirection`.

Heading direction values:
```
1 4 6
2 0 7
3 5 8
```

* **speed:** The velocity which will be used to follow the path.
* **alignOnNearestTile:** If activated (true) and the entity stops between tiles, it will automatically align on the nearest tile.

**drawPath(r, g, b, a, lineWidth)**

Draw the calculated path.

* **r, g and b:** The colour of the path.
* **a:** Alpha value of the colour.
* **lineWidth:** The width of the line ...

### nicerPath (since v1.3.0)
Activate it with `nicerPath: true,` in your entity. Check example-np!

**Attention**
* directionChangeMalus45degree, directionChangeMalus90degree and _preferManyWaypoints will be set to default values. Don't alter them.

#### Example image
![Example - nicerPath](https://raw.github.com/hurik/impact-astar-for-entities/master/example-nicerpath.png)


## Live demo
Check out: [http://www.andreasgiemza.de/impact-astar-for-entities/](http://www.andreasgiemza.de/impact-astar-for-entities/)

### Info
* The **green player** is controlled by clicking on the maps. It can't go through the obstacles, except the one in the middle. Check the player.js how it works ...
* The **red enemy** follows the player. Every 2 seconds it calculates the path to the player. It cannot pass every obstacle. Check the enemy.js how it works ...
* The **blue enemy** follows the player. Every 4 seconds his path is updated. It can pass the obstacles and it cannot move diagonal. Check the enemy2.js how it works ...


## Example
To change the level or work with the code, add in the example folder the missing library files and folders:
```
lib/weltmeister/
lib/impact/
tools/
index.htmlw
weltmeister.html
```


## Example images
![Example](https://raw.github.com/hurik/impact-astar-for-entities/master/example.png)


## TODO
* A* search algorithm (getPath)
	* Make it faster
	* Add coordinated movement (For the future ...)
	* More?
* path following (followPath)
	* Very much room for improvements ...
	* Make it more natural ...


## Credits
### Thanks to
* Joncom (Deactivate diagonal movement)
* FabienM (Heading Direction)
* docmarionum1 (Teleportation bug)
* tmfkmoney (Support for obstacles which are bigger than the tilesize)
* chadrickm (Max movement)

### Based on
* [https://gist.github.com/994534](https://gist.github.com/994534)
* [http://www.policyalmanac.org/games/aStarTutorial_de.html](http://www.policyalmanac.org/games/aStarTutorial_de.html)
* [http://theory.stanford.edu/~amitp/GameProgramming/index.html](http://theory.stanford.edu/~amitp/GameProgramming/index.html)


## Changelog
##### v1.3.1
* path following
    * Code cleanup + more comments
    * Now headingDirection and headingAngle are set. Use what you prefer.

#### v1.3.0
* A* search algorithm
    * Added nicerPath

##### v1.2.3
* A* search algorithm
	* Little bugfix with bigger entities
* General
	* Better example image

##### v1.2.2
* A* search algorithm
	* Little bugfix for the direction change maluses

##### v1.2.1
* A* search algorithm
	* Minor improvements
* General
	* Readme improved

#### v1.2.0
* A* search algorithm
	* Max movement (Thanks to chadrickm)
* General
	* Readme improved

#### v1.1.0
* A* search algorithm
	* Support for entities which are bigger than the tilesize, should be a multiple of the tilesize ... (Thanks to tmfkmoney)
* path following
	* Fix for teleportation bug (Thanks to docmarionum1)

### v1.0.0
* A* search algorithm
	* Entity support
* General
	* Readme improved
	* Example highly improved

##### v0.9.4
* path following
	* alignOnNearestTile option was added: If the path was erased before the entity has gotten to his destination and stands between two tiles, this little check will adlign it on the nearest tile

##### v0.9.3
* A* search algorithm
	* If diagonal movement is deactivated, it uses the manhattan distance heuristic
* path following
	* Heading direction is now saved in the headingDirection variable, for more information check the example (Thanks to FabienM)

##### v0.9.2
* A* search algorithm
	* Now using the diagonal distance heuristic
	* Added separate maluses for 45 degrees an 90 degree direction changes, still testing for good values for the maluses
* General
	* Converted indentation to tabs

##### v0.9.1
* A* search algorithm
	* Now it is possible to deactivate diagonal movement (Example: getPath(destinationX, destinationY, false), default is true!) (Thanks to Joncom)
	* The check for not cutting edges was improved
	* Small G and H calculation changes

#### v0.9.0
* A* search algorithm
	* Added malus for direction change -> now nicer paths
* General
	* Added new example image to explain the direction change malus
	* Example demo updated the new code
	* Readme improved

##### v0.8.3
* A* search algorithm
	* Path now only saves the nodes, when the walking direction changed (Much less path points)
* path drawing
	* Because the new path save style, its now a line, like in the debug
* General
	* Example image changed

##### v0.8.2
* General
	* Example image changed
	* Readme improved

##### v0.8.1
* General
	* Little example demo update

#### v0.8.0
* General
	* Added example

#### v0.7.0
* A* search algorithm
	* Now calculates the real distances, working with even numbers wasn't faster
* path drawing
	* Basic function added, only as an example for a possible implementation

#### v0.6.0
* A* search algorithm
	* Checks now for walkable tiles and not for walls, no more problems with slopes any more
* path following
	* Added entity movement stop when there is no path
	* No rounding any more for diagonal moments speed calculation (Doesn't impact the framerate)

##### v0.5.2
* path following
	* followPath now really working, but still far from perfect ...

##### v0.5.1
* path following
	* followPath working for low framrates but FAR from a good implementation

#### v0.5.0
* General
	* Added version numbering
	* New example image
* A* search algorithm
	* The start tile of the entity is not any more a part of the path
* path following
	* Added followPath(speed) function (Experimental at the moment, low framerates not working ...)
* Debug
	* Start point of the 'show paths' debug feature is now the middle of the entity