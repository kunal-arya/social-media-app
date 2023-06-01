import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  profileUser: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLogout: (state) => {
      (state.user = null), (state.token = null);
    },

    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },

    setProfileUserFriends: (state, action) => {
      if (state.profileUser) {
        state.profileUser.friends = action.payload.friends;
      } else {
        console.log(`Profile user Friends non-existent :( `);
      }
    },

    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },

    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },

    setProfileUser: (state, action) => {
      state.profileUser = action.payload;
    },

    setPicturePath: (state, action) => {
      if (state.user._id === action.payload.user._id) {
        state.user.picturePath = action.payload.user.picturePath;
      }

      /* if we are using the Icon Button in the profile dashboard to change the profile Picture, we need 
      to change the picturePath of the profileUser Also */
      if (state.profileUser._id === action.payload.user._id) {
        state.profileUser.picturePath = action.payload.user.picturePath;
      }
    },

    setCoverPicturePath: (state, action) => {
      if (state.user._id === action.payload.user._id) {
        state.user.coverPicturePath = action.payload.user.coverPicturePath;
      }

      /* if we are using the Button in the profile dashboard to change the Cover profile Picture, we need 
      to change the coverPicturePath of the profileUser Also */
      if (state.profileUser._id === action.payload.user._id) {
        state.profileUser.coverPicturePath =
          action.payload.user.coverPicturePath;
      }
    },

    setUserInfo: (state, action) => {
      if (state.user._id === action.payload.user._id) {
        state.user = action.payload.user;
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setProfileUser,
  setProfileUserFriends,
  setPicturePath,
  setCoverPicturePath,
  setUserInfo,
} = authSlice.actions;
export default authSlice.reducer;
