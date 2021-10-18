import fs from 'fs';

let allRooms = [];

function shuffleArray(array) {
  const shuffled = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * array.length);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRoom(dir, width, depth, maxWidth) {
  if (depth === 0) return;

  fs.mkdirSync(dir);
  allRooms.push(dir);

  for (let i = 0; i < width; i += 1) {
    const randomWidth = Math.floor(Math.random() * maxWidth) + 1;
    createRoom(`${dir}/room-${i}`, randomWidth, depth - 1, maxWidth);
  }
}

function createClues(dir, rooms, depth) {
  const content = {};
  if (depth <= 0) {
    content.treasure = true;
  } else {
    content.clue = rooms.pop();
    createClues(content.clue, rooms, depth - 1);
  }
  fs.writeFileSync(`${dir}/chest-1.json`, JSON.stringify(content));
  if (Math.random() < 0.3) fs.writeFileSync(`${dir}/chest-2.json`, 'I`m a chest decoy');
  if (Math.random() < 0.3) {
    fs.writeFileSync(
      `${dir}/chest-3.json`,
      JSON.stringify({
        clue: './bad/file/path',
      }),
    );
  }
}

/**
 * @param {String} mazeDir root directory name
 * @param {Number} maxWidth biggest amount of sub-rooms in every room
 * @param {Number} depth maze folder graph depth
 * @param {Number} length how many clues to the tressure
 */
export default function generateMaze(mazeDir, maxWidth, depth, length) {
  createRoom(mazeDir, maxWidth, depth, maxWidth);

  const startingClue = mazeDir;
  allRooms = allRooms.filter((dir) => dir !== startingClue);

  createClues(startingClue, shuffleArray(allRooms), length);
  return startingClue;
}
