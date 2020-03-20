const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {console.log("Connected to MongoDB")});

let userSchema = new mongoose.Schema({
  username: {
    type:  String,
    required: true,
    unique: true,
    maxlength: [20, "Username is too long"]
  },
  exercise: [{
    _id: false, //disables _id for exercises
    description: String,
    duration: Number,
    date: {} //allows date to be have format YYYY-MM-DD enforced by moment.js
  }]
});

module.exports = mongoose.model('User', userSchema);