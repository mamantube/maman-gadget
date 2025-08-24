import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk("product/getProducts", async ({ page = 1, per_page = 8, search = "" } = {}) => {
    const response = await axios.get("http://maman-gadget.test/api/products", {
        params: { page, per_page, search}
    });
    return response.data;
});

export const detailproduct = createAsyncThunk("product/detailProduct", async (id) => {
    const response = await axios.get(`http://maman-gadget.test/api/products/${id}`)
    return response.data;
});

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async({ product_id, quantity = 1}, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://maman-gatget.test/api/add-tp-carts", {product_id, quantity}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || {Message: "Terjadi kesalahan server coba beberapa saat lagi"})
        }
    }
)

const productSlice = createSlice({
    name: "product",
    initialState: {
        items: [],
        meta: {},
        links: {},
        selectedProduct: null,
        isLoading: false,
        errorMessage: "",
        // cartMessage: "",
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
        .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.errorMessage = "";
        })
        .addCase(addToCart.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(addToCart.rejected, (state) => {
            state.isLoading = false;
            state.errorMessage = action.payload?.Message || "Gagal menambahkan ke keranjang";
        })
    }
})

export default productSlice.reducer;