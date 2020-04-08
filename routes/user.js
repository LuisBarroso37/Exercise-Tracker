const express = require('express');
const router = express.Router();
const moment = require('moment');
let userModel = require('../models/user.model');

// User story 1 - I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
router.post('/api/exercise/new-user', async (req, res) => {
  let username = req.body.username;
  
  try {
  let user = await userModel.findOne({ username });
  
    if (user) {
      res.json('User already exists - id: ' + user._id);
    } else {
      let user = new userModel({
        username
      });
      
      await user.save();
      
      let id = user._id;
      res.json({ username, id });    
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
    }
  });

// User story 3 - I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add.
// If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
router.post('/api/exercise/add', (req, res) => {
  let userId = req.body.userId;
  let date = req.body.date;
  
  if(!date) {
    date = moment().format('YYYY-MM-DD');
  } else if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    date = moment().format('YYYY-MM-DD');
  } else {
    date = moment(date).format('YYYY-MM-DD');
  }
  
  let exercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: date
  };
  
  userModel.findOneAndUpdate({_id: userId}, {$push: {exercise}}, {new: true, useFindAndModify: false})
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error: ' + err));
});

// User story 2 - I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
router.get('/api/exercise/users', (req, res) =>{
    userModel.find()
    .then(users => 
      res.send(users.map(user => {
      return { username: user.username, id: user._id };
      }))
    )
    .catch(err => res.status(400).json('Error: ' + err));
});

// User story 4 - I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id).
// Return will be the user object with added array log and count (total exercise count).
router.get('/api/exercise/log', (req, res) => {
  let userId = req.query.userId;
  let queries = { // User story 5
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit
  };
  
  userModel.findById({_id: userId})
  .then(user => {
    
    // User story 5 - I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
    if(queries.from && queries.to) {
      user.exercise = user.exercise.filter(key => key.date >= queries.from && key.date <= queries.to);
    } else if (queries.from) {
      user.exercise = user.exercise.filter(key => key.date >= queries.from);
    } else if (queries.to) {
      user.exercise = user.exercise.filter(key => key.date <= queries.to);
    } else if (queries.limit) {
      user.exercise = user.exercise.slice(0, queries.limit);
    }
    
    res.send({
      username: user.username,
      exercise: user.exercise,
      totalExerciseCount: user.exercise.length
    });
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;