import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardDetail from './components/CardDetail';
import CardSearch from './components/CardSearch';
import Navbar from './components/NavBar';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CardSearch />} />
          <Route path="card/:cardName" element={<CardDetail />} />
        </Routes>
      </Router>
  );
}

export default App;
