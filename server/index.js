const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User.js");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET_KEY;

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Running at Port: http://localhost:${PORT}/`);
});

// User Register API

const checkDatabaseDuplication = async (request, response, next) => {
  const { username, email } = request.body;
  try {
    const isAlreadyUsername = await User.findOne({ username });
    if (isAlreadyUsername !== null) {
      response.status(409).json("Username already taken");
    } else {
      const isAlreadyEmail = await User.findOne({ email });
      if (isAlreadyEmail === null) {
        next();
      } else {
        response.status(409).json("Email already taken");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

app.post("/register", checkDatabaseDuplication, async (request, response) => {
  const { username, password, email } = request.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({ username, email, password: hashPassword });
  await jwt.sign({ userId: createdUser._id }, jwtSecret, (error, token) => {
    if (error) throw error;
    response.json(token);
  });
});

// User Login API

const checkUserValidation = async (request, response, next) => {
  try {
    const { username, password } = request.body;
    const isUsernameAvailable = await User.findOne({username});
    
    if (isUsernameAvailable !== null ){
      const comparedPassword = await bcrypt.compare(password, isUsernameAvailable.password);
      if (comparedPassword === true){
        next()
      }else{
        response.status(400).json("Password didn't match");
      }
    }else{
      response.status(400).json("Username not Found");
    }
  } catch (error) {
    console.log(error);
  }
};

app.post("/login", checkUserValidation, async (request, response) => {
  const {username} = request.body
  const isUsernameAvailable = await User.findOne({username});
  const payload = { userId: isUsernameAvailable._id }
  await jwt.sign(payload, jwtSecret, (error, token) => {
    if (error) throw error;
    response.json(token);
  });
});

// API 3
