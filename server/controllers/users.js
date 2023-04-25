import User from "../models/User.js";

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
    const { id, friendId } = req.params;

    // Finding the user by the extracted 'id'
    const user = await User.findById(id);

    // Finding the friend by the extracted 'friendId'
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // Checking if the friendId is already included in the user's friends array

      // If so, remove the friendId from user's friends array
      user.friends = user.friends.filter((id) => id !== friendId);

      // Also remove user's id from friend's friends
      friend.friends = friend.friends.filter((id_friends) => id_friends !== id);
      array;
    } else {
      // If friendId is not included in user's friends array

      // Add the friendId to user's friends array
      user.friends.push(friendId);

      // Also add user's id to friend's friends array
      friend.friends.push(id);
    }

    // Saving the updated user object to the database
    await user.save();
    // Saving the updated friend object to the database
    await friend.save();

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
