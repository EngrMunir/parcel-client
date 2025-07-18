import { baseApi } from "../../api/baseApi";

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // checked
    getAllAgent: builder.query({
      query: () => ({
      url: '/users?role=AGENT',
      method: 'GET',
      }),
    }),
     getSingleUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),
    
    getUsers: builder.query({
      query:()=>{
        return { url:'/users', method:'GET' }
      },
      providesTags:['users']
    }),

    

    changeUserRole: builder.mutation({
      query:(data)=>({
        url:'/auth/role-change',
        method:'PATCH',
        body:data
      })
    }),
    deleteUsers: builder.mutation({
      query:(userId)=>{
        return { 
          url:`/auth/delete-user/${userId}`, 
          method:'DELETE',
         }
      },
    }),
  }),
});

export const {
  useGetAllAgentQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useDeleteUsersMutation,
  useChangeUserRoleMutation,
} = userManagementApi;

