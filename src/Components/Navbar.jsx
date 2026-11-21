import React from 'react';
import "./styles/Navbar.css";

const Navbar = ({toggleDarkMode,darkMode}) => {
  return (
    <div className='Navbar'>
      <h1 className='logo'>Recipe Finder</h1>
      <button
        onClick={toggleDarkMode}
        className='dark-btn'
        type='button'
        aria-pressed={darkMode}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
};

export default Navbar;