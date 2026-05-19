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
            query: (id) => {
                return {
                    url: `/appointment/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),

        getLastAppointmentDate: builder.query<{ data: { result: { visitingDate: string } | null } }, number>({
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
        updateAppointmentStatus: builder.mutation<void, { id: number; status: "BOOKED" | "PRESENT" | "ABSENT" }>({
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
    }),
});

export const {
    useCreateAppointmentMutation,
    useGetAllAppointmentByDateQuery,
    useGetAppointmentByIdQuery,
    useGetLastAppointmentDateQuery,
    useUpdateAppointmentMutation,
    useUpdateAppointmentStatusMutation,
    useDeleteAppointmentMutation,
} = appointmentApi;
