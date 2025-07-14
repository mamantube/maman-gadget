import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Landing} />
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
