import { baseApi } from "./baseApi";

const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAppointmentDailyReportByDate: builder.query({
            query: (date?: string) => {
                return {
                    url: `/report/daily-report?date=${date}`,
                    method: "GET",
                };
            },
            providesTags: ["appointment"],
        }),
    }),
});

export const {
    useGetAppointmentDailyReportByDateQuery,
} = reportApi;
