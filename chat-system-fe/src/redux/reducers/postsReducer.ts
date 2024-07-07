import { createSlice } from '@reduxjs/toolkit';

const init:any = [];

export const PostSlice = createSlice({
  name: 'post',
  initialState: init,
  reducers: {
    setPosts: (state, action) => {
      return action.payload;
    },
    addPost: (state, action) => {
      return [action.payload, ...state];
    },
    clearPosts: (state) => {
      return init;
    },
  },
});

export const { setPosts, clearPosts, addPost } = PostSlice.actions;