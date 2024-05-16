import './App.css';
import CardSearch from './components/CardSearch';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardDetail from './components/CardDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardSearch/>} />
        <Route path="card/:cardName" element={<CardDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;
