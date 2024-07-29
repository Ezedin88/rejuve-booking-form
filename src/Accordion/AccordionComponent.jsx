import { useState } from 'react';
import propTypes from 'prop-types';
import '../accordionStyle.css';
const TwistAccordion = ({ title,userIndex, children,setLineItems,lineItems,treatmentChoices,nadItem }) => {
  const [isOpen, setIsOpen] = useState(false);

const currentAccordionCheckedItems = lineItems.filter(item => item.userIndex === userIndex);
const filteredCheckedItems = currentAccordionCheckedItems.filter(item => treatmentChoices.some(treatment => treatment.id === item.product_id));

// from nadTreatmentChoices i want to filter item where item's variation id is same as the product id

// const filteredNadTreatmentChoices = treatmentChoices
// .flatMap(item => item.variations)
// .find(variation => variation.id === 1890);
const nadTreatmentCheckedItems = currentAccordionCheckedItems?.filter(item=> treatmentChoices.flatMap(item => item?.variations).some(variation => variation?.id === item?.variation_id))||[];

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
        {filteredCheckedItems?.length > 0 && !nadItem?
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
        }):null
      }
      {
        nadItem && 
        nadTreatmentCheckedItems?.length > 0 ?
        nadTreatmentCheckedItems.map((item,index) => {
          return (
            <div key={index} className='checked-item'>
              <p>{item.productName}</p>
              <button className='close-icon'
              onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                setLineItems(lineItems.filter(product =>product.productName !== item.productName))
              }}
              >
                <img src='http://rejuve.com/wp-content/uploads/2024/05/close-icon-1.svg' alt='close-icon' />
              </button>
            </div>
          )
        }):null
      }
        
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
  title: propTypes.string,
  userIndex: propTypes.number.isRequired,
  ivTherapy: propTypes.string,
  children: propTypes.node.isRequired,
  setLineItems: propTypes.func.isRequired,
  lineItems: propTypes.array.isRequired,
  treatmentChoices: propTypes.array.isRequired,
  nadItem: propTypes.bool
}