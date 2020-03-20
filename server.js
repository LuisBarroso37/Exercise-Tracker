const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/user');

const app = express();

//Allows FreeCodeCamp to test the project
app.use(cors());

//Parse the information submitted in the form from the url
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Get file user.js
app.use(userRoute);

//Apply css styles to html.file
app.use(express.static('public'));

//Send html file when the link to the webpage is entered
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// 404 - Not found error middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware - 400 and 500 error
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})
