import { apiSlice } from "./api.service";

export const spendingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExpense: builder.mutation({
            query: (body) => ({
                url: "/expense/create",
                method: "POST",
                body
            }),
            invalidatesTags: ["Expense"]
        }),
        updateExpense: builder.mutation({
            query: ({ body, expense_id }) => ({
                url: `/expense/update/${expense_id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Expense"]
        }),
        deleteExpense: builder.mutation({
            query: (expense_id) => ({
                url: `/expense/delete/${expense_id}`,
                method: "DELETE",
                body: {}
            }),
            invalidatesTags: ["Expense"]
        }),
        getExpense: builder.query({
            query: () => "/expense/get",
            providesTags: ["Expense"],
        }),

    })
})

export const { useCreateExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation, useGetExpenseQuery } = spendingsApi;