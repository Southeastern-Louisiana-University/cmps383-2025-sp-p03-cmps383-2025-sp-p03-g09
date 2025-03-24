import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/home';
import MovieList from './Pages/Movie/movielist';
import MovieDetail from './Pages/Movie/moviedetail';
import About from './Pages/About/About';
import FoodList from './Pages/Food/foodlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/food" element={<FoodList />} />
      </Routes>
    </Router>
  );
}

export default App;