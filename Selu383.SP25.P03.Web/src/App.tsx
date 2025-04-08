import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/home';
import MovieList from './Pages/Movie/movielist';
import MovieDetail from './Pages/Movie/moviedetail';
import About from './Pages/About/about';
import FoodList from './Pages/Food/foodlist';
import FoodDetail from './Pages/Food/fooddetail';
import Login from './Pages/Account/login';
import MovieCreate from './Pages/Movie/moviecreate';
import SelectTicket from './Pages/Ticket/selectticket';
import PurchaseTicket from './Pages/Ticket/purchaseticket';
import Cart from './Pages/Cart/cart';
import PurchaseConfirmation from "./Pages/Purchase/PurchaseConfirmation";
import PurchaseHistory from "./Pages/Purchase/PurchaseHistory";
import FoodCreate from './Pages/Food/foodcreate';
import MovieEdit from './Pages/Movie/movieedit';
import FoodEdit from './Pages/Food/foodedit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/food" element={<FoodList />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/create" element={<MovieCreate />} />
        <Route path="/movies/:movieId/select-ticket" element={<SelectTicket />} />
        <Route path="/movies/:movieId/purchase" element={<PurchaseTicket />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchase/confirmation" element={<PurchaseConfirmation />} />
        <Route path="/purchase/history" element={<PurchaseHistory />} />
        <Route path="/food/create" element={<FoodCreate />} />
        <Route path="/movies/:id/edit" element={<MovieEdit />} />
        <Route path="/food/:id/edit" element={<FoodEdit />} />
      </Routes>
    </Router>
  );
}

export default App;