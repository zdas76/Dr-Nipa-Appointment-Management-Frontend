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
  }),
});
export const { useLoginMutation } = authApi;
