// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  // baseUrl: `https://api.fastcaredermalyn.com/api/v1`,
  baseUrl: `http://localhost:5000`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: [
    "user",
    "subCategory",
    "category",
    "unit",
    "product",
    "bank",
    "chemist",
    "post",
    "depo",
    "supplier",
    "ledgerHead",
    "journal",
    "inventory",
    "stakeholder",
    "degree",
    "designation",
    "scope",
    "order",
    "report",
    "mpoTarget",
    "workingDay",
    "depo_transection",
  ],
  endpoints: () => ({}),
});
