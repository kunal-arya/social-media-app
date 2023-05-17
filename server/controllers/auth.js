import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Generating a salt for password hashing
    const salt = await bcrypt.genSalt();

    // Hashing the password using the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    // Creating a new user object with the hashed password and other fields
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 500),
      impressions: 500 + Math.floor(Math.random() * 1000),
      linkedinProfile: "",
      twitterProfile: "",
    });

    // Saving the new user object to the database
    const savedUser = await newUser.save();

    // Sending success response with the saved user object
    res.status(201).json(savedUser);
  } catch (err) {
    // Handling any errors that may occur and sending error response
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */

export const login = async (req, res) => {
  try {
    // Destructuring email and password from request body
    const { email, password } = req.body;

    // Finding a user with the provided email in the database
    const user = await User.findOne({ email: email });

    if (!user) {
      // If user not found, return error response
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Comparing the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If password does not match, return error response
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Generating a JSON Web Token (JWT) with user's id as payload and using the JWT_SECRET from environment variables as the secret key
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Removing the password field from the user object before sending the response
    delete user.password;

    // Sending success response with JWT and user object
    res.status(200).json({ token, user });
  } catch (err) {
    // Handling any errors that may occur and sending error response
    res.status(500).json({ error: err.message });
  }
};
