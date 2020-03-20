const express = require('express');
const router = express.Router();
const moment = require('moment');
let userModel = require('../models/user.model');

//Post request to get username submitted by the user
router.post('/api/exercise/new-user', async (req, res) => {
  let username = req.body.username;
  
  try {
  let user = await userModel.findOne({ username });
  
    if (user) {
      res.status(500).send('User already exists');
    } else {
      let user = new userModel({
        username
      });
      
      await user.save();
      
      let id = user._id;
      res.send({ username, id });    
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
    }
  });

//POST REQUEST to add exercise data submitted by the user to an _id
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

//GET request to get all users from databse
router.get('/api/exercise/users', (req, res) =>{
    userModel.find()
    .then(users => 
      res.send(users.map(user => {
      return { username: user.username, id: user._id };
      }))
    )
    .catch(err => res.status(400).json('Error: ' + err));
});

//GET request to get the full exercise log of an user via the _id
router.get('/api/exercise/log', (req, res) => {
  let userId = req.query.userId;
  let queries = {
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit
  };
  
  userModel.findById({_id: userId})
  .then(user => {
    //let exercises = user.exercise;
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