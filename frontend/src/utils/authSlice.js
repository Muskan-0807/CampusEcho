import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    restoreAuth:(state,action) =>{
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    GetUser:(state,action) =>{
      state.user={
      ...state.user,
      ...action.payload
      }
            state.isAuthenticated = true;

     
    },

    
  },
});

export const { loginSuccess, logout ,restoreAuth,GetUser} = authSlice.actions;
export default authSlice.reducer;