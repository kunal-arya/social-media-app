import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
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

      if (state.profileUser._id === action.payload.user._id) {
        state.profileUser.picturePath = action.payload.user.picturePath;
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
} = authSlice.actions;
export default authSlice.reducer;
