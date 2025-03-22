import { apiSlice } from "./api.service";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (body) => ({
                url: "/register/user",
                method: "POST",
                body
            }),
            invalidatesTags: ["User"]
        }),
        getUsers: builder.query({
            query: () => "/user/get/all",
            providesTags: ["User"],
        }),
        getUser: builder.query({
            query: () => "/user/get",
            providesTags: ["User"],
        }),
        getUserBalance: builder.query({
            query: (user_id) => `/user/${user_id}/balance`,
            providesTags: ["User"],
        }),
        getUserProjects: builder.query({
            query: (user_id) => `/user/projects/${user_id}`,
            providesTags: ["User"],
        }),
        getAllUserProjects: builder.query({
            query: (user_id) => `/user/all/projects/${user_id}`,
            providesTags: ["User"],
        }),
        editUser: builder.mutation({
            query: ({ body, user_id }) => ({
                url: `/user/${user_id}`, 
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        

    })
})

export const { useCreateUserMutation, useGetUserBalanceQuery, useGetUserQuery, useGetUsersQuery, useLazyGetUserProjectsQuery, useEditUserMutation, useLazyGetAllUserProjectsQuery } = userApi;