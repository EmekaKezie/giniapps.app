import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  counter: 0,
};

const zestSlice = createSlice({
  initialState: initialState,
  name: "ztestSlice",
  reducers: {
    onIncrement: (state) => {
      state.counter += 1;
    },
    onDecrement: (state) => {
      state.counter -= 1;
    },
  },
});

export const { onIncrement, onDecrement } = zestSlice.actions;
export default zestSlice.reducer;
