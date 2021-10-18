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
    console.log(clue);
    return path.normalize(clue);
  } catch (err) {
    return false;
  }
}

findTreasureSync(mazePath);
