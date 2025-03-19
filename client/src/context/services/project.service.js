import { apiSlice } from "./api.service";

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (body) => ({
                url: "/project/create",
                method: "POST",
                body
            }),
            invalidatesTags: ["Project"]
        }),
        getProjects: builder.query({
            query: () => "/project/get/",
            providesTags: ["Project"],
        }),
        editProject: builder.mutation({
            query: ({ body, project_id }) => ({
                url: `/project/update/${project_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Project"],
        }),

        finishProject: builder.mutation({
            query: (project_id) => ({
                url: `/project/finish/${project_id}`,
                method: "PUT",
                body: {},
            }),
            invalidatesTags: ["Project"],
        }),
        payProject: builder.mutation({
            query: ({ body, project_id }) => ({
                url: `/project/pay/${project_id}`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Project"],
        }),

        deleteProject: builder.mutation({
            query: (project_id) => ({
                url: `/project/delete/${project_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),

    })
})

export const { useCreateProjectMutation, usePayProjectMutation, useGetProjectsQuery, useEditProjectMutation, useDeleteProjectMutation, useFinishProjectMutation } = projectApi;