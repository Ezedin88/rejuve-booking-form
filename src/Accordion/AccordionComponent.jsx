import { useState } from 'react';
import propTypes from 'prop-types';
import '../accordionStyle.css';
const TwistAccordion = ({ title,userIndex, children,setLineItems,lineItems,treatmentChoices }) => {
  const [isOpen, setIsOpen] = useState(false);
const currentAccordionCheckedItems = lineItems.filter(item => item.userIndex === userIndex);
// filter currentaccordioncheckeditems that much with treatmentchoices id
const filteredCheckedItems = currentAccordionCheckedItems.filter(item => treatmentChoices.some(treatment => treatment.id === item.product_id));

  return (
    <div className={`accordion-section ${isOpen? 'open' : ''} accordion-main-wrapper`}
    >
      <button onClick={(e) => {e.preventDefault();setIsOpen(!isOpen)}} className='accordion-btn'
    style={{cursor:'pointer'}}
      >
       <div style={{display:'flex'}} className='accordion-title-shower-wrapper'>
        <div className='accordion-title'>
       <p style={{margin:'0px !important'}} className='accordion-the-title'>{title}</p> 
       <div className="checked-items-wrapper">
        {filteredCheckedItems?.length > 0 && 
        filteredCheckedItems.map((item,index) => {
          return (
            <div key={index} className='checked-item'>
              <p>{item.productName}</p>
              <button className='close-icon'
              onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                setLineItems(lineItems.filter(product =>product.product_id!==item.product_id))
              }}
              >
                <img src='http://rejuve.com/wp-content/uploads/2024/05/close-icon-1.svg' alt='close-icon' />
              </button>
            </div>
          )
        })}
        
       </div>
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

TwistAccordion.propTypes = {
  title: propTypes.string.isRequired,
  userIndex: propTypes.number.isRequired,
  ivTherapy: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
  setLineItems: propTypes.func.isRequired,
  lineItems: propTypes.array.isRequired,
  treatmentChoices: propTypes.array.isRequired
}