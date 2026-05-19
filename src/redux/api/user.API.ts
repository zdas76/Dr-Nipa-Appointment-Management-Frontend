import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        AssistantRegistration: builder.mutation({
            query: (info) => {
                return {
                    url: "/users",
                    method: "POST",
                    body: info,
                };
            },
            invalidatesTags: ["user", "assistant"],
        }),
    })
})

export const {
    useAssistantRegistrationMutation,
} = userApi;