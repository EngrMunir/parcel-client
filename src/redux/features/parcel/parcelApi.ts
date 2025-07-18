import { baseApi } from "../../api/baseApi";

const parcelManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // checked
    createParcel: builder.mutation({
      query: (parcelData) => ({
        url: "/parcels",
        method: "POST",
        body: parcelData,
      }),
    }),
    // checked
    getCustomerParcels: builder.query({
        query: () => ({
        url: "/parcels/customer",
        method: "GET",
        }),
        transformResponse: (response: any) => response.data,
    }),
    
    getAllParcels: builder.query({
      query: () => ({
        url: "/parcels",
        method: "GET",
      }),
      transformResponse: (response: any) => ({
        data: response.data,
      }),
    }),

    getSingleParcel: builder.query({
      query: (parcelId: string) => ({
        url: `/parcels/track/${parcelId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => ({
        data: response.data,
      }),
    }),

    deleteParcel: builder.mutation({
      query: (parcelId: string) => ({
        url: `/parcels/${parcelId}`,
        method: "DELETE",
      }),
    }),
    // From parcelManagementApi.ts
assignAgent: builder.mutation({
  query: ({ id, agentId }) => ({
    url: `/parcels/${id}/assign`,
    method: 'PATCH',
    body: { agentId },
  }),
}),

    cancelParcel: builder.mutation({
      query: (data) => ({
        url: '/bookParcel/cancel',
        method: 'PATCH',
        body: data,
      }),
    }),
    cancelDeliveryParcel: builder.mutation({
      query: (data) => ({
        url: '/bookParcel/cancel',
        method: 'PATCH',
        body: data,
      }),
    }),
     getMyDeliveryList: builder.query({
      query: (email: string) => `/myDeliveryList?email=${email}`,
    }),
  }),
});

export const {
  useGetCustomerParcelsQuery,
  useGetAllParcelsQuery,
  useGetSingleParcelQuery,
  useCreateParcelMutation,
  useDeleteParcelMutation,
  useAssignAgentMutation,
  useCancelParcelMutation,
  useCancelDeliveryParcelMutation,
  useGetMyDeliveryListQuery,
} = parcelManagementApi;


// // parcelApi.ts
// export const parcelApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
   
    
//     deliverParcel: builder.mutation({
//       query: (data) => ({
//         url: '/bookParcel/cancel',
//         method: 'PATCH',
//         body: data,
//       }),
//     }),
//   }),
// });

// export const {
//   useDeliverParcelMutation,
// } = parcelApi;
