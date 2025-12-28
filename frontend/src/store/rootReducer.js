import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authenticationSlice";
import forgotPasswordReducer from "../features/forgotpasswordSlice";
import loadingReducer from "../features/loadingSlice";
const rootReducer = combineReducers({
    auth : authReducer,
    forgotPassword : forgotPasswordReducer ,
    loading : loadingReducer
});

export default rootReducer;