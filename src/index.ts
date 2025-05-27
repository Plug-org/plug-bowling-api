const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/users.route');
const gamesRouter = require('./routes/games.route');

//runs db init at app start.
require('./db/init');

// Start Express server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
