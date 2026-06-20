import type { TPatient } from "../../types/User";
import { baseApi } from "./baseApi";

const patientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        PatientRegistration: builder.mutation({
            query: (info) => {
                return {
                    url: "/patient",
                    method: "POST",
                    body: info,
                };
            },
            invalidatesTags: ["patient"],
        }),
        getAllPatient: builder.query({
            query: (debouncedSearch: string) => {

                return {
                    url: `/patient?search=${debouncedSearch}`,
                    method: "GET",

                };
            },
            providesTags: ["patient"],
        }),

        getAllPatientSearch: builder.query({
            query: (debouncedSearch: string) => {

                return {
                    url: `/patient/search?search=${debouncedSearch}`,
                    method: "GET",

                };
            },
            providesTags: ["patient"],
        }),

        getPatientById: builder.query({
            query: (patientId: number) => {

                return {
                    url: `/patient/${patientId}`,
                    method: "GET",
                };
            },
            providesTags: ["patient"],
        }),
        updatePatient: builder.mutation<TPatient, Partial<TPatient>>({
            query: ({ id, ...info }) => {
                return {
                    url: `/patient/${id}`,
                    method: "PATCH",
                    body: info,
                };
            },
            invalidatesTags: ["patient"],
        }),
        deletePatient: builder.mutation({
            query: (id) => {
                return {
                    url: `/patient/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["patient"],
        }),
    }),
});

export const {
    usePatientRegistrationMutation,
    useGetAllPatientQuery,
    useGetPatientByIdQuery,
    useUpdatePatientMutation,
    useDeletePatientMutation,
    useGetAllPatientSearchQuery
} = patientApi;
