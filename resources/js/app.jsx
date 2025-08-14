import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
import { Provider } from "react-redux";
import { store } from "./store/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from "./layout/Landing";

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Landing />}>
                        <Route index path="/" element={<Beranda />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
