import { apiSlice } from "./api.service";

export const serviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createService: builder.mutation({
            query: (body) => ({
                url: "/service/create",
                method: "POST",
                body
            }),
            invalidatesTags: ["Service"]
        }),
        updateService: builder.mutation({
            query: ({ body, service_id }) => ({
                url: `/service/update/${service_id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Service"]
        }),
        deleteService: builder.mutation({
            query: ({ service_id }) => ({
                url: `/service/delete/${service_id}`,
                method: "DELETE",
                body: {}
            }),
            invalidatesTags: ["Service"]
        }),
        getService: builder.query({
            query: () => "/service/get",
            providesTags: ["Service"],
        }),

    })
})

export const { useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation, useGetServiceQuery } = serviceApi;