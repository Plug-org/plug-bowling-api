# Plug Bowling API
A beginner-friendly API which will let you go beyond simple CRUD operations. This API handles the game logic of a bowling match and works by updating and saving game state which is sent back in responses to the client. Requests from the client are pretty simple (usually just providing an `id`representing a user or game, or `number` representing pins ). The backend handles the logic of game play and game state updates. So the challenge for the frontend is what to do with that game state in the context of your particular version of a bowling game. The game logic might seem like the real challenge but there is still a lot to do on the client and many interpreations of how a particular client can be designed and implemented.

## Contents
+ [installation](#installation)
+ [useful scripts](#useful-scripts)
+ [usage](#usage)
    + [endpoints for users](#users)
    + [endpoints for games](#games)
+ [suggestions](#some-ideas)
## Installation
1. clone repo inside your project directory
```bash

git clone https://github.com/Plug-org/plug-bowling-api.git
cd plug-bowling-api
```
2.  install dependencies
```bash
npm run install
```
3.  run server
```bash
npm run dev
```
4.  seed db
```bash
npm run seed
```
The server will start at http://localhost:5000
### Useful scripts
* Reset the db if you ever want to "start over". 
This will delete your data and reset it to its starting state.
```bash
npm run reset
```
* run the gameEngine file to see how this class works
```bash
npm run game
```
For the `npm run game` script  to work you will need to add something like this in the `gameEngine.ts` file then run `npm run game` in your terminal. You can obviously play around with different logging and methods. This isn't necessary to create the client but is just here if you want an easy way to directly experiment with the `GameEngine`
```js
function runGame(){
  const myGame = new GameEngine("_id1");
  
  myGame.roll(5);
  
  console.log(myGame.getState())
  console.log(myGame.getState().frames)
};

runGame()
```



## **Usage**

## *Users*
### Get all users
```js
GET /users
```
successful response
```js
[
    {
        "id": 15,
        "name": "Donnie",
        "created_at": "2025-05-27 16:26:37"
    },
    {
        "id": 16,
        "name": "The Big Lebowski",
        "created_at": "2025-05-27 16:26:37"
    }
]
```

### Get a user by id
```js
GET /users/:id
```
successful response
```js
{
    "id": 15,
    "name": "Donnie",
    "created_at": "2025-05-27 16:26:37"
}
```

### Create a user
```js
PUT /users

//req body
{
  "name": "user name"
}
```
successful response
```js
{
    "id": 17,
    "name": "New User",
    "created_at": "2025-05-27 16:30:32"
}
```

### Edit a user
```js
PUT /users/:id

//req body
{
  "name": "updated name"
}
```
successful response
```js
{
    "id": 15,
    "name": "New Name.",
    "created_at": "2025-05-27 16:26:37"
}
```

### Delete a user
```js
DELETE /users/:id
```
successful response
```js
{
    "success": true
}
```

API supports keeping a deleted user's games (for showing in leaderboards for example). If you want to delete a user and their games there are two separate endpoints for each.
### Delete all of a user's games
```js
DELETE /users/:id/games
```
successful response
```json
{
    "success": true,
    "deletedGames": 3 //number of games deleted
}
```


## *Games*
### Get all games
```js
GET /games
```
successful response
```json
[
  {
    "id": "c1cb2ae6-16cb-41d3-81a3-c3287fcb84dd",
    "userId": "f8e7c13a-2991-42d6-8dec-aff21386f57e",
    "frames": [
        {
            "rolls": [
                3,
                2
            ],
            "isSpare": false,
            "score": 5
        }
    ],
    "currentFrameIndex": 1,
    "isComplete": false,
    "createdAt": "2025-05-28 20:20:33"
  },
  ...more game objects
]
```

### Get a game by its id
```js
GET /games/:id
```
successful response
```json
  {
    "id": "c1cb2ae6-16cb-41d3-81a3-c3287fcb84dd",
    "userId": "f8e7c13a-2991-42d6-8dec-aff21386f57e",
    "frames": [
        {
            "rolls": [
                3,
                2
            ],
            "isSpare": false,
            "score": 5
        }
    ],
    "currentFrameIndex": 1,
    "isComplete": false,
    "createdAt": "2025-05-28 20:20:33"
  },
```
### Create a new game
```js
POST /games/

//req body
{
    "userId":"ceaf1ab5-0795-4120-81ce-aa6fbe520e08"
}
```
successful response
```json
{
    "id": "d687882e-ba65-4f4d-96ec-ae041b9b2c12",
    "userId": "f8e7c13a-2991-42d6-8dec-aff21386f57e",
    "frames": [],
    "currentFrameIndex": 0,
    "isComplete": false,
    "createdAt": "2025-05-28 20:31:53"
}
```
### Delete a game
```js
DELETE /games/:id
```
successful response
```json
{
  "success": true
}
```
### updatescore
```js
POST /games/rolls

//req body: id is the game id.
{
    "id": "c1cb2ae6-16cb-41d3-81a3-c3287fcb84dd",
    "pins": 3

}
```
successful response
```json
{
    "id": "c1cb2ae6-16cb-41d3-81a3-c3287fcb84dd",
    "userId": "f8e7c13a-2991-42d6-8dec-aff21386f57e",
    "frames": [
        {
            "rolls": [
                3
            ]
        }
    ],
    "currentFrameIndex": 0,
    "isComplete": false,
    "createdAt": "2025-05-28 20:20:33"
}
```



## Some ideas:
Game types:
>Support 1+ of the following gaming formats
1. players play alone
2. matches can be created between two+ players
3. matches can be created between two+ teams of players

This means understanding how the API handles game creation and adapting that to your needs as well as keeping in mind the limitations of the API.

Handling players:

>support one or both of the following?
1. users select from list of available players (from seeded data)
2. ability to create a new user 

You can customize to allow user creation (a user is just a `name` string)

Extras:
> What else can you do with the relatively simple data this API sends?
1. show list of users and their high and low scores.
2. show list of highest scoring games

Creating the above lists might prove challenging once your app has created a number of users or games as the backend hasn't implemented pagination. As an extra challenge you can try to implement this on the backend or look at a way of handling it on the client. See [Tanstack Table](https://tanstack.com/table/v8/docs/guide/pagination) for a frontend solution

## UI/UX
Given the API handles the game logic and much of the game state you will be free to focus on deepening your UI building skills. Go deeper in animations and focusing on building components.

### Some links to useful reading and resources
**libraries**

1. [Matter.js](https://brm.io/matter-js/)
2. [GSAP](https://gsap.com/)
3. [Pixi.js](https://pixijs.com/)

**the browser**
1. [pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
2. [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
3. [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

