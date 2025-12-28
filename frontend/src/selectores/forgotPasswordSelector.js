import { createSelector } from "@reduxjs/toolkit";

//state of forgot password
const selectForgotPasswordState = (state) => state.forgotPassword;

export const selectEmailSent = createSelector(
    [selectForgotPasswordState],
    (forgotPassword) => forgotPassword.emailSent
);

export const selectErrorSentEmail = createSelector(
    [selectForgotPasswordState],
    (forgotPassword) => forgotPassword.error
);

export const selectEmail = createSelector(
    [selectForgotPasswordState],
    (forgotPassword) => forgotPassword.email
);