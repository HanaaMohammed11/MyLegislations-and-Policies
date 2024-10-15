import React from 'react';
import './Planet.css'; 
import planet from "../../../../../src/assets/plant-removebg-preview.png"

const Planet = () => {
  return (
    <div className="planet-container">
      <img
        src={planet}
        alt="Logo"
        className="planet"
      />
    </div>
  );
};

export default Planet;
