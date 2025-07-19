import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../features/store";

const baseQuery = fetchBaseQuery({
    baseUrl:'http://localhost:5000/api',
    credentials:"include",
    prepareHeaders: (headers, { getState }) => {
  const state = getState() as RootState;
  let token = state.auth?.token;

  // Fallback if Redux is empty after refresh
  if (!token) {
    token = localStorage.getItem("accessToken") || null;
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  return headers;
},

});

export const baseApi = createApi({
    reducerPath:'baseApi',
    baseQuery:baseQuery,
    tagTypes:['cart','users','user'],
    endpoints:()=>({})
})