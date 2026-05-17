import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface TAuthInfo {
  user: {
    id?: number | string;
    name: string;
    email: string;
    employeeId: string;
    role: string[];
    exp: number;
    iat: number;
  } | null;
  token: string | null;
}
const initialState = {
  user: null,
  token: null,
} satisfies TAuthInfo as TAuthInfo;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<TAuthInfo>) => {
      state.user = action.payload?.user;
      state.token = action.payload?.token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { addUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
