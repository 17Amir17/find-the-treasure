# FileSystem and the Node.js fs module

In computing, file system or filesystem (often abbreviated to fs) is a method and data structure that the operating system uses to control how data is stored and retrieved. Without a file system, data placed in a storage medium would be one large body of data with no way to tell where one piece of data stops and the next begins. By separating the data into pieces and giving each piece a name, the data is easily isolated and identified. Taking its name from the way paper-based data management system is named, each group of data is called a "file." The structure and logic rules used to manage the groups of data and their names is called a "file system."
[Wikipedia](https://en.wikipedia.org/wiki/File_system)

## Navigating the FileSystem using a [Shell](https://en.wikipedia.org/wiki/Shell_(computing))

In this section we'll cover some basic shell commands for navigating the filesystem. The shell we'll be using is [PowerShell](https://docs.microsoft.com/en-us/powershell/), but the commands are basic enough to work in most other shells.

* `ls` (or `dir` in Windows Shell)
* `pwd` Print Working Directory 
* `cd` Change Directory
* `..` (double dot) reference to the parent directory.
* `.` (single dot) reference to the current directory.
* `~` reference to the home directory.
* `/` reference to the root directory.
* `cat` print files content
* `mkdir` Make Directory
* `rm` Remove directory
* `echo` write to standart output

## Standart Input / Standart Output
```js
process.stdin.on("data", dataBuffer => {
    const input = dataBuffer.toString().trim();
    try {
        // const content = fs.readdirSync(`${__dirname}\\${input}`);
        const content = fs.readdirSync(path.relative(__dirname, input));
        process.stdout.write(content.join("\n"));
        process.exit(0);
    } catch(e) {
        process.stderr.write(e.toString());
        process.exit(1);
    }
});
```

## fs methods
* fs.readdir
* fs.readFile
* fs.lstat
* fs.writefile

## Resources
http://masteruby.github.io/productivity-booster/2014/03/26/top-ten-commands-in-terminal-you-will-use-everyday.html

https://nodejs.dev/learn/nodejs-file-paths

https://nodejs.dev/learn/reading-files-with-nodejs

https://nodejs.dev/learn/writing-files-with-nodejs

https://nodejs.dev/learn/working-with-folders-in-nodejs

## Assignment
Your assignment is to find the `treasure` in the Maze. The Maze is set of files spread across your filesystem. Each directory represents a `room`, each file represents a `chest`.

* Each `room` can hold zero or more `chest`s
* To open a chest, simply try parsing it's content as JSON. **NOTE:** Some chest are decoy and cannot be opened.
* Each openable `chest` can hold either the `treasure` **or** a `clue`
* A `clue` can lead to another `room`, **it might also lead nowhere**

### **Instructions:** ###
* Your aim is to write sync/async functions to navigate the maze to find the treasure
1. The maze enterance in located in the `./maze` directory
2. Uppon entering a room, try opening all the chests
3. For each `chest` you succeed opening, check if `tressure` is there.
4. If not, try following the `clue` to another `room`
5. Uppon entering a `room` mark the location of the `room` path in the `map.txt` file

```js
// Easy: sync functions, return answer syncronously and throw errors
function findTreasureSync(roomPath) {}
function openChestSync(chestPath) {}
function drawMapSync(currentRoomPath) {}

// Hard: async functions, use node-style callbacks for result and error handeling
function findTreasure(roomPath, cb) {}
function openChest(chestPath, cb) {}
function drawMapSync(currentRoomPath, cb) {}

// Bonus: use **fs.promises**
async function promiseTreasure(roomPath) {}
async function promiseTreasure(roomPath) {}
async function drawMapSync(currentRoomPath) {}
```

### **Chests examples**
```json
{"clue": "./room-1/room-2/"}
```

```json
{"clue": "😈"}
```

```json
{"clue": "./room-1/room-2/../../room-3/"}
```

```json
{"treasure": "💰"}
```

### **Maze stucture example**
```
./maze
├── chest-1.json
├── chest-2.json
├── chest-3.json
├── room-0
│   └── room-0
│       └── chest-1.json
├── room-1
│   ├── room-0
│   │   ├── chest-1.json
│   │   └── chest-2.json
│   ├── room-1
│   ├── room-2
├── room-2
│   ├── room-0
└── room-3
    ├── chest-1.json
    ├── room-0
    │   ├── chest-1.json
    │   └── chest-3.json
    └── room-1
        ├── chest-1.json
        └── chest-3.json
```

### **Map.txt example**
```
./room-0
./room-2/room-3
./room-3/room-1
./room-2
💰
```