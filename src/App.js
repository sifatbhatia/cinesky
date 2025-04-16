import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import MapView from "./Components/MapView/MapView";
import WeatherSearch from "./Components/Search/WeatherSearch";
import ListView from "./Components/List/List";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/mapview" element={<MapView/>} />
            <Route path="/search" element={<WeatherSearch/>} />
            <Route path="/list" element={<ListView/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/" element={<Register/>} />
          </Routes>
      </Router>
      </div>
  );
}

export default App;
