import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Travelers from './Travelers';
//import Agencies from './Agencies';
//import Trips from './Trips';

function App() {
  return (
      <Router>
        <Routes>
          {/* Početna ruta */}
          <Route path="/" element={<Home />} />

          {/* Ostale rute */}
          <Route path="/travelers" element={<Travelers />} />
            {/*<Route path="/agencies" element={<Agencies />} />
          <Route path="/trips" element={<Trips />} />*/}
        </Routes>
      </Router>
  );
}

export default App;

