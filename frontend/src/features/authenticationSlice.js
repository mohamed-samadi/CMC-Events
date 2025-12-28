import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        isAuthenticated :  Boolean(user) ,
        user : user,
        error : null
    },
    reducers : {
        loginSuccess : (state , action) => {
            state.isAuthenticated = true;
            state.user = action.payload  ;
            state.error = null ;
            }
        ,
        loginFailure : (state , action) => {
            state.isAuthenticated = false;
            state.user = null ;
            state.error = action.payload ;
        },
        logout : (state) => {
            state.isAuthenticated = false;
            state.user = null ;
        }
    }
})
export const { loginSuccess, logout , loginFailure } = authSlice.actions;
export default authSlice.reducer;