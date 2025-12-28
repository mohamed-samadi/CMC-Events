import { createSlice } from "@reduxjs/toolkit";

const forgotPasswordSlice = createSlice({
    name : 'forgotPassword',
    initialState : {
        emailSent : false,
        error : null ,
        email : ''
    },  
    reducers : {
        sendEmailSuccess : (state , action) => {
            state.emailSent = true;
            state.error = null ;
            state.email = action.payload ;
        },
        sendEmailFailure : (state , action) => {
            state.emailSent = false;
            state.error = action.payload ;
            state.email = '' ;
        }
    }
})
export const { sendEmailSuccess, sendEmailFailure } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;