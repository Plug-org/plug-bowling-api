const { v4: uuidv4 } = require('uuid');

const initialUsers = [
  {
    "id":uuidv4(),
    "name": "Donnie"
  },
  {
    "id": uuidv4(),
    "name": "The Big Lebowski"
  }
];


const initialGames = [
  {
    "id":uuidv4(),
    "userId": "",
    "frames": [
  { "rolls": [ 5, 2 ], "isSpare": false, "score": 7 },
  { "rolls": [ 3, 7 ], "isSpare": true,  "score": 13 },
  { "rolls": [ 3, 6 ], "isSpare": false, "score": 9 },
  { "rolls": [ 2, 8 ], "isSpare": true,  "score": 10 },
  { "rolls": [ 0, 10 ],"isSpare": true,  "score": 13 },
  { "rolls": [ 3, 4 ], "isSpare": false, "score": 7 },
  { "rolls": [ 3, 4 ], "isSpare": false, "score": 7 },
  { "rolls": [ 3, 4 ], "isSpare": false, "score": 7 },
  { "rolls": [ 3, 4 ], "isSpare": false, "score": 7 },
  { "rolls": [ 3, 4 ], "score": 7 }
    ],
    "currentFrameIndex": 9,
    "isComplete": true
  },
  {
    "id":uuidv4(),
    "userId": "",
    "frames": [
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10 ], "isStrike": true, "score": 30 },
  { "rolls": [ 10, 10, 10 ], "score": 30 }
    ],
    "currentFrameIndex": 9,
    "isComplete": true
  }
];

module.exports = { initialUsers, initialGames };


