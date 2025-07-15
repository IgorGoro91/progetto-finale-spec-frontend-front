import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CarDetailPage from './components/CarDetailPage';
import Preferiti from './components/Preferiti';
import SearchBar from './components/SearchBar';
import CarComparator from './components/CarComparator';


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/preferiti" element={<Preferiti />} />
        <Route path="/cars" element={<SearchBar />} />
        <Route path="/compare" element={<CarComparator />} />
       
      </Routes>
    </Router>
  );
}
