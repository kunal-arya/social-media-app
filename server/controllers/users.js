import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    // Extracting the 'id' parameter from the request parameters
    const { id } = req.params;

    // Finding the user by the extracted 'id'
    const user = await User.findById(id);

    // Mapping through the user's 'friends' array and finding each friend by their 'id'
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // Formatting the retrieved friends' information into a new array
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    // Sending the formatted friends' information as a JSON response with a 200 status code
    res.status(200).json(formattedFriends);
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

// Exporting an asynchronous function named addRemoveFriend
export const addRemoveFriend = async (req, res) => {
  try {
    // Extracting the 'id' and 'friendId' parameters from the request parameters
    const friendId = req.params.friendId;
    const userId = req.params.id;

    // Finding the user by the extracted 'id'
    const user = await User.findById(userId);

    // Finding the friend by the extracted 'friendId'
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // Checking if the friendId is already included in the user's friends array

      // If so, remove the friendId from user's friends array
      user.friends = user.friends.filter((id) => id !== friendId);

      // Also remove user's id from friend's friends
      friend.friends = friend.friends.filter((id) => id !== userId);
    } else {
      // If friendId is not included in user's friends array

      // Add the friendId to user's friends array
      user.friends.push(friendId);

      // Also add user's id to friend's friends array
      friend.friends.push(userId);
    }

    // Saving the updated user object to the database
    await user.save();
    // Saving the updated friend object to the database
    await friend.save();

    // Mapping through the user's 'friends' array and finding each friend by their 'id'
    const userFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // Formatting the retrieved user's friends' information into a new array
    const formattedUserFriends = userFriends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    const friendFriends = await Promise.all(
      friend.friends.map((id) => User.findById(id))
    );

    const formattedFriendFriends = friendFriends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    // Sending the formatted friends' information as a JSON response with a 200 status code
    res.status(200).json({
      userFriends: formattedUserFriends,
      friendFriends: formattedFriendFriends,
    });
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE PROFILE PIC */

export const changeProfilePicture = async (req, res) => {
  try {
    const { id, newPicturePath } = req.params;

    const user = await User.findById(id);
    let posts = await Post.find();

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.userId === id) {
          post.userPicturePath = newPicturePath;
          await post.save(); // save individual post
          return post;
        }
        return post;
      })
    );

    await Promise.all(
      posts.map(async (post) => {
        post.comments = post.comments.map((comment) => {
          if (comment.userId === id) {
            comment.userPicturePath = newPicturePath;
          }
          return comment;
        });
        await post.save();
        return post;
      })
    );

    user.picturePath = newPicturePath;

    await user.save();

    res.status(200).json({
      user: { _id: user._id, picturePath: user.picturePath },
      posts: updatedPosts,
    });
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE COVER PICTURE */
export const changeCoverPicture = async (req, res) => {
  try {
    const { id, coverPicturePath } = req.params;

    const user = await User.findById(id);

    user.coverPicturePath = coverPicturePath;

    await user.save();

    res.status(200).json({
      user: { _id: user._id, coverPicturePath: user.coverPicturePath },
    });
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ message: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      linkedinProfile,
      twitterProfile,
    } = req.body;

    let user = await User.findById(id);

    // Generating a salt for password hashing
    const salt = await bcrypt.genSalt();

    // Hashing the password using the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    // Update the user object with the new values
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = passwordHash;
    user.location = location;
    user.occupation = occupation;
    user.linkedinProfile = linkedinProfile;
    user.twitterProfile = twitterProfile;

    // Save the updated user
    const savedUser = await user.save();

    res.status(200).json({
      user: savedUser,
    });
  } catch (err) {
    // Handling any errors that occur and sending a JSON response with a 404 status code
    res.status(404).json({ status: "fail", message: err.message });
  }
};
