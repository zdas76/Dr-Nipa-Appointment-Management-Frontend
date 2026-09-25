import { baseApi } from "./baseApi";

const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendSms: builder.mutation({
      query: (data: { toUser: string; messageContent: string }) => {
        return {
          url: `/sms`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["sms"],
    }),
  }),
});

export const { useSendSmsMutation } = smsApi;
