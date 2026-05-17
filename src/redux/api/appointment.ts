import type { TAppointment } from "../../types/User";
import { baseApi } from "./baseApi";

const appointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAppointment: builder.mutation({
            query: (info) => {
                return {
                    url: "/appointment",
                    method: "POST",
                    body: info,
                };
            },
            invalidatesTags: ["appointment"],
        }),
        getAllAppointment: builder.query({
            query: () => {
                return {
                    url: "/appointment",
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),
        getAppointmentById: builder.query<TAppointment, number>({
            query: (id) => {
                return {
                    url: `/appointment/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),

        getLastAppointmentDate: builder.query<{ data: { result: string | null } }, number>({
            query: (patientId: number) => {
                return {
                    url: `/appointment/last-date?patientId=${patientId}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),

        updateAppointment: builder.mutation<TAppointment, Partial<TAppointment>>({
            query: ({ id, ...info }) => {
                return {
                    url: `/appointment/${id}`,
                    method: "PATCH",
                    body: info,
                };
            },
            invalidatesTags: ["appointment"],
        }),
        deleteAppointment: builder.mutation({
            query: (id) => {
                return {
                    url: `/appointment/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["appointment"],
        }),
    }),
});

export const {
    useCreateAppointmentMutation,
    useGetAllAppointmentQuery,
    useGetAppointmentByIdQuery,
    useGetLastAppointmentDateQuery,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
} = appointmentApi;
