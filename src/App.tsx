import "./App.scss";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Minesweeper from "./components/minesweeper/Minesweeper";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/minesweeper" element={<Minesweeper />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
