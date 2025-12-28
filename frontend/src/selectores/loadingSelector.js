import { createSelector } from "@reduxjs/toolkit";

const selectLoadingState = (state) => state.loading;

export const selectIsLoading = createSelector(
    [selectLoadingState],
    (loading) => loading.isLoading
);