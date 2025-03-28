import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/home';
import MovieList from './Pages/Movie/movielist';
import MovieDetail from './Pages/Movie/moviedetail';
import About from './Pages/About/about';
import FoodList from './Pages/Food/foodlist';
import Login from './Pages/Account/login';
import MovieCreate from './Pages/Movie/moviecreate';
import SelectTicket from './Pages/Ticket/selectticket';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/food" element={<FoodList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/create" element={<MovieCreate />} />
        <Route path="/movies/:movieId/select-ticket" element={<SelectTicket />} />
      </Routes>
    </Router>
  );
}

export default App;