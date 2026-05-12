import type { TAssistant } from "../../types/User";
import { baseApi } from "./baseApi";

const assistantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
        getAssistantById: builder.query<TAssistant, number>({
            query: (id) => {
                return {
                    url: `/assistant/${id}`,
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
        }),
    }),
});

export const {
    useAssistantRegistrationMutation,
    useGetAllAssistantQuery,
    useUpdateAssistantMutation,
    useDeleteAssistantMutation,
    useGetAssistantByIdQuery,
} = assistantApi;
