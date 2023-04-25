import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    // Extracting data from the request body
    const { userId, description, picturePath } = req.body;

    // Finding the user by their userId in the User model
    const user = await User.findById(userId);

    // Creating a new Post document with the extracted data and additional fields
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    // Saving the new post document to the database
    await newPost.save();

    // Finding all posts in the Post model in descending order by createdAt timestamp
    const posts = await Post.find().sort({ createdAt: -1 });

    // Sending a JSON response with a 201 status code and the retrieved posts
    res.status(201).json(posts);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 409 status code
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    // Finding all posts in the Post model in descending order by createdAt timestamp
    const posts = await Post.find().sort({ createdAt: -1 });

    // Sending a JSON response with a 200 status code and the retrieved posts
    res.status(200).json(posts);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Finding all posts by the User in descending order by createdAt timestamp
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    // Sending a JSON response with a 200 status code and the retrieved posts
    res.status(200).json(posts);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    // Extract the 'id' parameter from the request URL
    const { id } = req.params;

    // Extract the 'userId' from the request body
    const { userId } = req.body;

    // Find the post in the database by its ID
    const post = await Post.findById(id);

    // Check if the user has already liked the post
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      // If the user has already liked the post, remove the like
      post.likes.delete(userId);
    } else {
      // If the user has not liked the post, add a like
      post.likes.set(userId, true);
    }

    // Save the updated post to the database
    await post.save();

    // Send a JSON response with the updated post
    res.status(200).json(post);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};
