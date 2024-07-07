import { createSlice } from '@reduxjs/toolkit';

const init = { 
  userName: '',
  access_token: '',
  _id:""
}

export const userSlice = createSlice({
  name: 'user',
  initialState: init, 
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    clearUser: (state) => {
      return init;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;