import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
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
import {
  changeCoverPicture,
  changeProfilePicture,
} from "./controllers/users.js";
import ChatRoutes from "./routes/chat.js";
import MessageRoutes from "./routes/message.js";
import { Octokit } from "@octokit/rest";

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

// Create a Octokit instance and authenticate with your github Token
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//---------------------------------------//
/********** SOCKET.IO SETUP **************/
//---------------------------------------//
let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    const isActiveUser = activeUsers.some((user) => user.userId === newUserId);

    if (!isActiveUser) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    console.log("Connected Users", activeUsers);
    // sending the activeUsers to the client side
    io.emit("get-users", activeUsers);
  });

  // send message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to: ", receiverId);
    console.log("data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("user Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

//---------------------------------------//
/*********** FILE STORAGE *************/
//---------------------------------------//

const storage = multer.memoryStorage();

const upload = multer({
  storage, // Set the "storage" configuration object defined earlier as the storage option for Multer
});

// This function uploads a picture file to GitHub repository
const githubPictureUpload = async (req, res, next) => {
  try {
    // Read the content of the uploaded file
    const fileContent = req.file.buffer;

    // Specify the details of the new file in your GitHub repository
    const repoOwner = "kunal-arya";
    const repoName = "social-media-app";
    const targetFolder = "server/public/assets";
    const fileName = req.file.originalname;

    // Create or update the file in your GitHub repository
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: `${targetFolder}/${fileName}`,
      message: "Add New Picture",
      content: fileContent.toString("base64"),
    });

    console.log("File saved to GitHub:", response.data.content.html_url);

    // Send a successful response
    next();
  } catch (err) {
    // Handle errors during file upload
    console.error("Error uploading file:", err);
    res
      .status(500)
      .json({ error: err.message, msg: "Error uploading file to GitHub" });
  }
};

//---------------------------------------//
/*********** ROUTES WITH FILES ***********/
//---------------------------------------//

// Set up a route for handling POST requests to "/auth/register" endpoint
app.post(
  "/auth/register",
  // Middleware for handling file uploads, expecting a single file with field name "picture"
  upload.single("picture"),
  githubPictureUpload,
  // Callback function for handling user registration logic
  register
);

app.post(
  "/posts",
  verifyToken,
  upload.single("picture"),
  githubPictureUpload,
  createPost
);

// Changing the Profile Picture
app.post(
  "/users/:id/:newPicturePath/changePicture",
  verifyToken,
  upload.single("picture"),
  githubPictureUpload,
  changeProfilePicture
);

// Changing the Cover Image
app.post(
  "/users/:id/:coverPicturePath/changeCover",
  verifyToken,
  upload.single("picture"),
  githubPictureUpload,
  changeCoverPicture
);

//---------------------------------------//
/*************** ROUTES ******************/
//---------------------------------------//

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chat", ChatRoutes);
app.use("/message", MessageRoutes);

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
    server.listen(PORT, () =>
      console.log(`Database Connected & Server Port: ${PORT}`)
    );
  })
  .catch((err) => console.log(`${err.message} didn't connect`));
