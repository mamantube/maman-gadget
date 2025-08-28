import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
import { Provider } from "react-redux";
import { store } from "./store/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from "./layout/Landing";
import Auth from "./layout/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Produk from "./pages/Produk";
import DetailProduk from "./pages/DetailProduk";
import Customer from "./layout/Customer";
import CartList from "./pages/customer/CartsList";

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Landing />}>
                        <Route index path="/" element={<Beranda />} />
                        <Route path="/product" element={<Produk />} />
                        <Route path="/product/detail-product/:id" element={<DetailProduk />} />
                    </Route>

                    <Route element={<Auth />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Route>

                    <Route element={<Customer />}>
                        <Route index path="/customer/beranda" element={<Beranda />} />
                        <Route path="/customer/product" element={<Produk />} />
                        <Route path="/customer/product/detail-product/:id" element={<DetailProduk />} />
                        <Route path="/customer/cart" element={<CartList />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
