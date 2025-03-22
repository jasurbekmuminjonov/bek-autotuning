import { apiSlice } from "./api.service";
export const salaryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getApprovedProjects: builder.query({
            query: (user_id) => `/project/approved/${user_id}`,
            providesTags: ["Salary", "User"],
        }),
        createSalary: builder.mutation({
            query: ({ body, user_id }) => ({
                url: `/user/pay/${user_id}`,
                body,
                method: "POST"
            }),
            invalidatesTags: ["Salary", "User"]
        }),
        updateSalary: builder.mutation({
            query: ({ body, user_id, salary_id }) => ({
                url: `/user/salary?user_id=${user_id}&salary_id=${salary_id}`,
                body,
                method: "PUT"
            }),
            invalidatesTags: ["Salary", "User"]
        }),
        deleteSalary: builder.mutation({
            query: ({ user_id, salary_id }) => ({
                url: `/user/salary?user_id=${user_id}&salary_id=${salary_id}`,
                body: {},
                method: "DELETE"
            }),
            invalidatesTags: ["Salary", "User"]
        })

    })
})

export const { useLazyGetApprovedProjectsQuery, useCreateSalaryMutation, useDeleteSalaryMutation, useUpdateSalaryMutation } = salaryApi;