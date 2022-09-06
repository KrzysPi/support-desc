const asyncHandler = require("express-async-handler"); //
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
// @desc    Register a new user
// @route   /api/user
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  //   console.log(req.body);
  const { name, email, password } = req.body; // zapisujemy zmienne z obiektu

  // Validation- jeżeli któreś nie istnieje chcemy zwrócić ERROR czyli odpowiedź servera ze stausem 400.
  if (!name || !email || !password) {
    //     return res.status(400).json({ message: "Please include all fields" });
    //   }
    //   // teraz w Postmen jak wyślemy zapytanie bez np. password dostaniemy status 400 i message jw.

    // zmianiemy na error hendler
    res.status(400);
    throw new Error("Please include all fields"); // zwraca HTML dlatego tworzymy middleware/errorMiddleware.js żeby zwrócił nam json
  }

  // E124 Find if user already exists

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // client error
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10); // pobiera klucz z jakim będzie hashowane hasło zalecane 10
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    // ok and created
    res.status(201).json({
      // 201- ok i created
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Invalid use data");
  }

  //   res.send("Register Route");
});

// @desc    Login a user
// @route   /api/user/login
// @access    res.send("Register Route");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // szuka urzytkownika

  // Sprawdza czy user i user password się zgadzają
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      // 201- ok i created
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // not authorized
    throw new Error("Ivalid credentials");
  }

  //   res.send("Login Route");
});

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  //   res.status(200).json(req.user);
  // poniżej ustalamy co ma być zwrócone w odpowiedzi
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});

// Generate Token
// funkcja sign() przyjmuje 3 argumenty id urzytkownika, klucz do generowania tokena, czas po jakim traci ważność
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
