import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (info: { userName: string; password: string }) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: info,
        };
      },
      invalidatesTags: ["user"],
    }),
    changePassword: builder.mutation({
      query: (payload: { currentPassword: string; newPassword: string }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: payload,
      }),
      // Assuming password change doesn't require cache invalidation but may refresh user token
      invalidatesTags: ["user"],
    }),
  }),
});
export const { useLoginMutation, useChangePasswordMutation } = authApi;
