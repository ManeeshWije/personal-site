import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Terminal from "./components/Terminal.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Terminal />} />
            </Routes>
        </Router>
    );
};

export default App;
