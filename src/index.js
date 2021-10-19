const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const mazePath = './maze';

// Easy: sync functions, return answer syncronously and throw errors
let found = false;
function findTreasureSync(roomPath) {
  drawMapSync(roomPath);
  const chests = getChestsInDir(roomPath);
  chests.forEach((chest) => {
    if (found) return;
    const content = openChestSync(path.resolve(roomPath, chest));
    if (hasTreasure(content)) {
      console.log('Treasure found!');
      found = true;
      return;
    } else {
      const cluePath = getCluePath(content.clue);
      if (cluePath) {
        findTreasureSync(cluePath);
      }
    }
  });
}

function openChestSync(chestPath) {
  try {
    const data = JSON.parse(fs.readFileSync(chestPath, 'utf8'));
    return data;
  } catch (err) {
    return false;
  }
}

function drawMapSync(currentRoomPath) {
  try {
    const data = fs.writeFileSync('./maze.txt', currentRoomPath + '\n', {
      flag: 'a+',
    });
  } catch (err) {
    console.error('Couldnt write');
  }
}

function getChestsInDir(dir) {
  const files = fs.readdirSync(dir);
  const arr = [];
  files.forEach((file) => {
    if (file.includes('.json')) arr.push(file);
  });
  return arr;
}

function hasTreasure(chest) {
  try {
    return 'treasure' in chest;
  } catch (error) {
    return false;
  }
}

function getCluePath(clue) {
  try {
    return path.normalize(clue);
  } catch (err) {
    return false;
  }
}

//findTreasureSync(mazePath);

// Hard: async functions, use node-style callbacks for result and error handeling
function findTreasure(roomPath, cb) {
  getChestsInDirAsync(roomPath, (err, chests) => {
    if (err) cb(err);
    else {
      loop(roomPath, chests);
    }
  });
}

function openChest(chestPath, cb) {
  fs.readFile(chestPath, 'utf8', (err, data) => {
    if (err) {
      cb(err, null);
      return;
    }
    try {
      cb(null, JSON.parse(data));
    } catch (error) {
      cb(error, null);
    }
  });
}

function drawMapASync(currentRoomPath, cb) {
  fs.writeFile('./maze.txt', currentRoomPath + '\n', { flag: 'a+' }, (err) => {
    if (err) {
      cb(err, null);
      return;
    }
    cb(null, true);
  });
}

function getChestsInDirAsync(dir, cb) {
  fs.readdir(dir, (err, files) => {
    if (err) cb(err, null);
    else {
      const chests = [];
      files.forEach((file) => {
        if (file.includes('.json')) {
          chests.push(file);
        }
      });
      cb(null, chests);
    }
  });
}

const loop = (roomPath, chests) => {
  openChest(path.resolve(roomPath, chests.pop(0)), (error, chest) => {
    if (error) {
      loop(roomPath, chests);
    } else {
      drawMapASync(roomPath, (err) => {
        if (err) console.log('Couldnt write');
      });
      if (hasTreasure(chest)) {
        console.log('Treasure Found');
        drawMapASync('Treasure Found! ✔', () => {});
      } else {
        const cluePath = getCluePath(chest.clue);
        if (cluePath) {
          findTreasure(cluePath, (err) => {
            if (err) loop(roomPath, chests);
          });
        } else {
          loop(roomPath, chests);
        }
      }
    }
  });
};

// findTreasure(mazePath);

// Bonus: use **fs.promises**
async function promiseTreasure(roomPath) {
  try {
    const chests = await promiseReaddir(roomPath);
    await promiseDrawMap(roomPath);
    chests.forEach((chest) => {
      promiseOpenChest(path.resolve(roomPath, chest)).then(
        (content) => {
          if (hasTreasure(content)) {
            console.log('Treasure found!');
            promiseDrawMap('Threasure Found ✔');
          } else {
            const cluePath = getCluePath(content.clue);
            promiseTreasure(cluePath);
          }
        },
        (err) => {}
      );
    });
  } catch (error) {}
}
async function promiseOpenChest(roomPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(roomPath, 'utf8', (err, chest) => {
      if (err) {
        reject(err);
      }
      try {
        chest = JSON.parse(chest);
        resolve(chest);
      } catch (error) {
        reject(error);
      }
    });
  });
}
async function promiseDrawMap(currentRoomPath) {
  fs.writeFile('./maze.txt', currentRoomPath + '\n', { flag: 'a+' }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
async function promiseReaddir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      else {
        files = files.filter((file) => file.includes('.json'));
        resolve(files);
      }
    });
  });
}

promiseTreasure(mazePath);
