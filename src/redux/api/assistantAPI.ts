import type { TUpdateAssistant } from "../../component/assistant/UpdateAssistantForm";
import type { TAssistant } from "../../types/User";
import { baseApi } from "./baseApi";

const assistantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
        updateAssistant: builder.mutation<TAssistant, { id: number, data: Partial<TUpdateAssistant> }>({
            query: ({ id, data }) => {
                return {
                    url: `/assistant/${id}`,
                    method: "PATCH",
                    body: data,
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
    useGetAllAssistantQuery,
    useUpdateAssistantMutation,
    useDeleteAssistantMutation,
    useGetAssistantByIdQuery,
} = assistantApi;
