import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk("product/getProducts", async ({ page = 1, per_page = 8, search = "" } = {}) => {
    const response = await axios.get("http://maman-gadget.test/api/products", {
        params: { page, per_page, search}
    });
    return response.data;
});

export const detailproduct = createAsyncThunk("product/detailProduct", async (id) => {
    const response = await axios.get(`http://maman-gadget.test/api/${id}`)
    return response.data;
});

const productSlice = createSlice({
    name: "product",
    initialState: {
        items: [],
        meta: {},
        links: {},
        selectedProduct: null,
        isLoading: false,
        errorMessage: "",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getProducts.pending, (state) => {
            state.isLoading = true;
            state.errorMessage = "";
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.items = action.payload.data;
            state.meta = action.payload.meta;
            state.links = action.payload.links;
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.error.errorMessage;
        })
        .addCase(detailproduct.pending, (state) => {
            state.isLoading = true;
            state.errorMessage = "";
            state.selectedProduct = null;
        })
        .addCase(detailproduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedProduct = action.payload.data
        })
        .addCase(detailproduct.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.error.errorMessage;
        })
    }
})

export default productSlice.reducer;