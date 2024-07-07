// src/redux/slices.js
import { combineReducers } from 'redux';
import { userSlice } from './authReducer';
import { PostSlice } from './postsReducer';


export const rootReducer = combineReducers({
  auth: userSlice.reducer,
  posts:PostSlice.reducer
});

