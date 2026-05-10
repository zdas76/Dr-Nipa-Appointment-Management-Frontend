import type { TAssistant } from "../../types/User";
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

    AssistantRegistration: builder.mutation({
      query: (info) => {
        return {
          url: "/assistant",
          method: "POST",
          body: info,
        };
      },
      invalidatesTags: ["user"],
    }),
    getAllAssistant: builder.query({
      query: () => {
        return {
          url: "/assistant",
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    updateAssistant: builder.mutation<TAssistant, Partial<TAssistant>>({
      query: ({ id, ...info }) => {
        return {
          url: `/assistant/${id}`,
          method: "PATCH",
          body: info,
        };
      },
      invalidatesTags: ["user"],
    }),
    deleteAssistant: builder.mutation({
      query: (id) => {
        return {
          url: `/assistant/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["user"],
    })


  }),
});
export const { useLoginMutation, useAssistantRegistrationMutation, useGetAllAssistantQuery, useUpdateAssistantMutation, useDeleteAssistantMutation } = authApi;
