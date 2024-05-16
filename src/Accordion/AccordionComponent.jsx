import React, { useState } from 'react';
import '../accordionStyle.css';

const TwistAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-section ${isOpen? 'open' : ''}`}
    >
      <button onClick={(e) => {e.preventDefault();setIsOpen(!isOpen)}}>
       <div style={{display:'flex',background:'skyblue',width:'100%'}}>
        {title} {isOpen? '▲' : '▼'}
        </div> 
      </button>
      {isOpen && <div className="content">{children}</div>}
    </div>
  );
};

export default TwistAccordion;