import { apiSlice } from "./api.service";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (body) => ({
        url: "/project/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    getProjects: builder.query({
      query: () => "/project/get/",
      providesTags: ["Project"],
    }),
    getProjectsForApprove: builder.query({
      query: () => "/project/approve/",
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
    startProject: builder.mutation({
      query: ({ project_id, service_id }) => ({
        url: `/project/start/${project_id}/${service_id}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["Project"],
    }),
    finishService: builder.mutation({
      query: ({ project_id, service_id }) => ({
        url: `/project/service/finish/${project_id}/${service_id}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["Project"],
    }),
    approveProject: builder.mutation({
      query: ({ project_id, approving_service, starting_service }) => ({
        url: `/project/service/approve?project_id=${project_id}&approving_service=${approving_service}&starting_service=${starting_service}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["Project"],
    }),
    rejectProject: builder.mutation({
      query: ({ project_id, rejecting_service }) => ({
        url: `/project/service/reject?project_id=${project_id}&rejecting_service=${rejecting_service}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsForApproveQuery,
  usePayProjectMutation,
  useGetProjectsQuery,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useFinishProjectMutation,
  useApproveProjectMutation,
  useStartProjectMutation,
  useRejectProjectMutation,
  useFinishServiceMutation,
} = projectApi;
