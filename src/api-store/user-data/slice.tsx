import { createSlice } from "@reduxjs/toolkit";

export type userDataState = {
  user_name: string;
  name: string;
  access_token: string;
};

const initialState: userDataState = {
  user_name: "",
  name: "",
  access_token: "",
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState: initialState,
  reducers: {
    setLogoutState: () => initialState,
    setUserData: (state, action) => {
      state.user_name = action.payload.user_name;
      state.name = action.payload.name;
      state.access_token = action.payload.access_token;
    },
  }
});

export const { setUserData, setLogoutState } = userDataSlice.actions;
export default userDataSlice.reducer;
