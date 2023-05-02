import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { changeProfilePicture } from "./controllers/users.js";

//---------------------------------------//
/********** CONFIGURATIONS ***************/
//---------------------------------------//

// Get the file system path of the current module's file
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module's file
export const __dirname = path.dirname(__filename);

// Load environment variables from a .env file
dotenv.config();

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Enable security headers using the Helmet middleware
app.use(helmet());

// Set cross-origin resource policy to "cross-origin" using the Helmet middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Create a custom format function that includes the timezone offset
morgan.token("customdate", (req, res, tz) => {
  return new Date().toLocaleString("en-US", { timeZone: tz });
});

// Set the timezone for logging
const timeZone = "Asia/Kolkata"; // Use the valid timezone identifier for IST

// Configure Morgan middleware with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms [:customdate[" +
      timeZone +
      "]]"
  )
);

// Parse incoming JSON request bodies with a limit of 30MB and extended option set to true
app.use(bodyParser.json({ limit: "30mb", extended: true }));

// Parse incoming URL-encoded request bodies with a limit of 30MB and extended option set to true
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Serve static assets from the "public/assets" directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//---------------------------------------//
/*********** FILE STORAGE *************/
//---------------------------------------//

const storage = multer.diskStorage({
  // Define the destination folder where the uploaded files will be saved
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // Call the callback function with null for error (no error) and the destination folder path
  },
  // Define how the uploaded files should be named
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Call the callback function with null for error (no error) and the original filename
  },
});

const upload = multer({
  storage, // Set the "storage" configuration object defined earlier as the storage option for Multer
});

//---------------------------------------//
/*********** ROUTES WITH FILES ***********/
//---------------------------------------//

// Set up a route for handling POST requests to "/auth/register" endpoint
app.post(
  "/auth/register",
  // Middleware for handling file uploads, expecting a single file with field name "picture"
  upload.single("picture"),
  // Callback function for handling user registration logic
  register
);

app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post(
  "/users/:id/:newPicturePath/changePicture",
  verifyToken,
  upload.single("picture"),
  changeProfilePicture
);

//---------------------------------------//
/*************** ROUTES ******************/
//---------------------------------------//

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//---------------------------------------//
/*********** MONGOOSE SETUP **************/
//---------------------------------------//

const PORT = process.env.PORT || 6001;

// connecting mongoose to our database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Database Connected & Server Port: ${PORT}`)
    );
  })
  .catch((err) => console.log(`${err.message} didn't connect`));
