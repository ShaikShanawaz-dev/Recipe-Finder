import React from 'react';
import "./styles/Loader.css";

const Loader = () => {
  return (
    <div className='loader'>
      <div className='spinner'></div>
      <p>Loading Recipe</p>
    </div>
  );
};

export default Loader;