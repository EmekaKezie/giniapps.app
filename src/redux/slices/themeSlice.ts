import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkTheme: false,
};

const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    onToggleTheme: (state) => {
      state.darkTheme = !state.darkTheme;
    },
  },
});

export const { onToggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
