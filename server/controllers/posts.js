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

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    // getting post id
    const { postId, userId } = req.params;

    const post = await Post.findById(postId);

    if (userId !== post.userId) {
      throw new Error("Access Denied, you can't delete someone's else post");
    }

    await Post.deleteOne(post);

    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

/* POST COMMENT */

export const postComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const { userId, comment } = req.body;

    const user = await User.findById(userId);

    const post = await Post.findById(postId);

    const { firstName, lastName, picturePath } = user;

    post.comments.push({
      userId,
      firstName,
      lastName,
      userPicturePath: picturePath,
      comment,
    });

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const { userId, commentId } = req.body;
    let post = await Post.findById(postId);

    const myComment = post.comments.filter(
      (currComment) => currComment._id.toString() === commentId
    );

    console.log(userId, commentId, myComment[0]);
    if (userId !== myComment[0].userId) {
      throw new Error("Access Denied, you can't delete someone's else comment");
    }

    post.comments = post.comments.filter(
      (currComment) => currComment._id.toString() !== commentId
    );

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};
