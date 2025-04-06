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
        setWeekend: builder.mutation({
            query: ({ body, user_id }) => ({
                url: `/user/weekend/${user_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        removeWeekend: builder.mutation({
            query: ({ body, user_id }) => ({
                url: `/user/weekend/${user_id}`,
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        pauseUser: builder.mutation({
            query: ({ user_id, body }) => ({
                url: `/user/${user_id}/pause`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        resumeUser: builder.mutation({
            query: ({ user_id, pause_id, body }) => ({
                url: `/user/${user_id}/${pause_id}/resume`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),



    })
})

export const { useCreateUserMutation, usePauseUserMutation, useResumeUserMutation, useSetWeekendMutation, useRemoveWeekendMutation, useGetUserBalanceQuery, useGetUserQuery, useGetUsersQuery, useLazyGetUserProjectsQuery, useEditUserMutation, useLazyGetAllUserProjectsQuery } = userApi;