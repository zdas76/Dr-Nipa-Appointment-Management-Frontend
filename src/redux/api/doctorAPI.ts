import { baseApi } from "./baseApi";

const doctorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateDoctor: builder.mutation({
            query: ({ email, ...data }) => {
                return {
                    url: `/doctor/${email}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["doctor"],
        }),

        getDoctor: builder.query({
            query: (email: string) => `/doctor/${email}`,
            providesTags: ["doctor"],
        }),

        getDoctorInfor: builder.query({
            query: () => `/doctor`,
            providesTags: ["doctor"],
        }),

        addSafe: builder.mutation({
            query: ({ id, payload }: { id: string, payload: { isSafe?: boolean | undefined, limit?: number | undefined, doctorId: string } }) => {
                return {
                    url: `/doctor/add-safe/${id}`,
                    method: "PATCH",
                    body: payload,
                }
            },
            invalidatesTags: ["doctor"],
        }),
    }),
});

export const { useUpdateDoctorMutation, useGetDoctorQuery, useAddSafeMutation, useGetDoctorInforQuery } = doctorApi;
