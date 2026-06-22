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
        getAllAppointmentByDate: builder.query({
            query: (date?: string) => {
                return {
                    url: `/appointment?date=${date}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),

        getAppointmentById: builder.query({
            query: (id: number) => {
                return {
                    url: `/appointment/${id}`,
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
        updateAppointmentStatus: builder.mutation<void, { id: number; status: "BOOKED" | "PRESENT" | "ABSENT" | "VISITED" }>({
            query: ({ id, status }) => ({
                url: `/appointment/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
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
        getLastVisitingDate: builder.query({
            query: (patientId: number) => {
                return {
                    url: `/appointment/last-visiting-date/${patientId}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),
    }),
});

export const {
    useCreateAppointmentMutation,
    useGetAllAppointmentByDateQuery,
    useGetAppointmentByIdQuery,
    useUpdateAppointmentMutation,
    useUpdateAppointmentStatusMutation,
    useDeleteAppointmentMutation,
    useGetLastVisitingDateQuery,
} = appointmentApi;
