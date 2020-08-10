# Exercise Tracker REST API

- I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
- I can get an array of all users by clicking the corresponding button which makes a GET request to api/exercise/users. Returned will be the usernames and corresponding ID's.
- I can add an exercise to any user by posting form data user ID (_id), description, duration, and optionally date to /api/exercise/add. If no date is supplied it will use the current date. Returned will be the user information with the added exercise.
- I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Returned will be the user information, exercise log and total exercise count.
- I can retrieve part of the log of any user by also passing along optional parameters like from & to or limit. (Date format = yyyy-mm-dd, limit = int)

![Exercise Tracker](https://user-images.githubusercontent.com/58770446/89814858-1a140480-db44-11ea-8645-0712ac35cef9.png)
