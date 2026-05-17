import type { TConnector } from "../../types/User";
import { baseApi } from "./baseApi";

const connectorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ConnectorRegistration: builder.mutation({
            query: (info) => {
                return {
                    url: "/connector",
                    method: "POST",
                    body: info,
                };
            },
            invalidatesTags: ["connector"],
        }),
        getAllConnector: builder.query({
            query: () => {
                return {
                    url: "/connector",
                    method: "GET",
                };
            },
            providesTags: ["connector"],
        }),
        getConnectorById: builder.query<TConnector, number>({
            query: (id) => {
                return {
                    url: `/connector/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["connector"],
        }),
        updateConnector: builder.mutation<TConnector, Partial<TConnector>>({
            query: ({ id, ...info }) => {
                return {
                    url: `/connector/${id}`,
                    method: "PATCH",
                    body: info,
                };
            },
            invalidatesTags: ["connector"],
        }),
        deleteConnector: builder.mutation({
            query: (id) => {
                return {
                    url: `/connector/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["connector"],
        }),
    }),
});

export const {
    useConnectorRegistrationMutation,
    useGetAllConnectorQuery,
    useGetConnectorByIdQuery,
    useUpdateConnectorMutation,
    useDeleteConnectorMutation,
} = connectorApi;
