import { apiSlice } from "./api.service";

export const davomatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createDavomat: builder.mutation({
            query: (body) => ({
                url: "/attendance/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Davomat"],
        })
    }),
});

export const {
    useCreateDavomatMutation
} = davomatApi;
