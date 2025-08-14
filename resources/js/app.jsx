import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
// import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { store } from "./store/store";

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Beranda />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
