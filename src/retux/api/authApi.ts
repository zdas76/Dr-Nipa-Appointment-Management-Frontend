import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (info: { employeeId: string; password: string }) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: info,
        };
      },
    }),
  }),
});
export const { useLoginMutation } = authApi;
