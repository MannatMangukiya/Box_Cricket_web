var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const app = express()

app.use(bodyParser.json())
app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

const url = 'mongodb://localhost:27017';
const dbName = 'Crowny';

mongoose.connect('mongodb://localhost:27017/Crowny')
var db = mongoose.connection
db.on('error', () => console.log("Error in Connecting to Database"))
db.once('open', () => console.log("Connected to Database"))
console.log('http://localhost:3000/index.html')
app.post("/sign_up", async (req, res) => {
    var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  var data = {
    "username" : username,
    "email": email,
    "password": password
  }
  db.collection('users').insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Succesfully")
    res.redirect('/login');
  })
  // return res.status(404).json({ message: 'Sign Up Successfull'});
})

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    const user = await db.collection("users").findOne({ email: email });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password === user.password) {
      res.redirect('/login_success');
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.set({
    "Allow-acces-Allow-Origin": '*'
  })
  res.sendFile(__dirname + "/index.html");
}).listen(3000);

app.get("/login", (req, res) => {
  res.redirect('/login.html');
});

app.get("/login_success", (req, res) => {
  res.redirect('/index.html');
})

console.log("Listening on port 3000")