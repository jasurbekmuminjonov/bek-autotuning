import { apiSlice } from "./api.service";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body
            })
        })
    })
})

export const { useLoginMutation } = authApi;