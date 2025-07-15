import React from 'react';
import { Link } from 'react-router-dom';  
import SearchBar from './SearchBar';

export default function Header() {
  const doSearch = (query) => {
    console.log('Sto cercando:', query);
  };

  return (
    <header>
      <div className='header-left'>
        <img src="/logol.png" alt="" className="logo" />
        <Link to="/">Homepage</Link>
        <Link to="/preferiti">Preferiti</Link>
        
        <Link to="/compare" style={{ marginLeft: '10px', fontWeight: 'bold' }}>
          Confronta
        </Link>
      </div>
      <div className="header-container"> 
        <SearchBar onSearch={doSearch} />
      </div>
    </header>
  );
}
