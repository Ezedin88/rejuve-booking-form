import React, { useState } from 'react';
import '../accordionStyle.css';
const TwistAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-section ${isOpen? 'open' : ''} accordion-main-wrapper`}
    >
      <button onClick={(e) => {e.preventDefault();setIsOpen(!isOpen)}} className='accordion-btn'>
       <div style={{display:'flex'}} className='accordion-title-shower-wrapper'>
        <div className='accordion-title'>
        {title} 
        </div>
        <div className='accordion-arrows'>
        {isOpen?<i className="arrow up"></i> : <i className="arrow down"></i>}
        </div>
        </div> 
      </button>
      {isOpen && <div className="content">{children}</div>}
    </div>
  );
};

export default TwistAccordion;