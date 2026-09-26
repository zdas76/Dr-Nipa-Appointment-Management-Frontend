import { baseApi } from "./baseApi";

const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendSms: builder.mutation({
      query: (data: {
        appointmentInfo: { contactNumber: string; appointmentId: number }[];
        messageContent: string;
      }) => {
        return {
          url: `/sms`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["sms"],
    }),

    getSMSByMessageId: builder.query({
      query: (messageId: string) => ({
        url: `/sms`,
        method: "GET",
        params: { messageId },
      }),
    }),
  }),
});

export const { useSendSmsMutation, useGetSMSByMessageIdQuery } = smsApi;
