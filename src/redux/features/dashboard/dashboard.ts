import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
