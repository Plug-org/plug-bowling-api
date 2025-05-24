# Plug Bowling API
A beginner-friendly API which will let you go beyond simple CRUD operations. This API handles the game logic of a bowling match and works by updating and saving game state which is sent back in responses to the client. Requests from the client are pretty simple (usually just providing an `id`representing a user or game, or `number` representing pins ). The backend handles the logic of game play and game state updates. So the challenge for the frontend is what to do with that game state in the context of your particular version of a bowling game. The game logic might seem like the real challenge but there is still a lot to do on the client and many interpreations of how a particular client can be designed and implemented.
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

# Endpoints

## Users
### Get all users
```js
GET /users
```
### Get a user by id
```js
GET /users/:id
```
### Create a user
```js
PUT /users

//req body
{
  "name": "user name"
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
* ### Delete a user
```js
DELETE /users/:id
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

