import { useState } from 'react';
import TwistAccordion from '../Accordion/AccordionComponent';

function ChooseTreatments({
    index,
    lineItems,
    setlineItems,
    treatmentChoices,
    ivTherapy,
    currentProduct,
    setCurrentProduct
}) {
// const checkedProducts = treatmentChoices.filter(treatment => lineItems.some(item => item.product_id === treatment.id));
// console.log('checked products-->',checkedProducts)
// const [checkedProducts, setCheckedProducts] = useState([]);
// console.log('checked products-->',checkedProducts)
console.log('lineItems-->',lineItems) 
  return (
    <>
    <TwistAccordion title={treatmentChoices?.[0]?.categories?.[0]?.name}
    userIndex={index}
    lineItems={lineItems}
    setLineItems={setlineItems}
    treatmentChoices={treatmentChoices}
    >
      <div className='treatments-wrapper'>
                        {treatmentChoices.map(treatment => (
                        <div key={treatment.id} className='check-box-price-wrapper'>
                          <div className='accordion-inner-wrapper'>
                          <div className="checkbox-title">
                            {
                              // ivTherapy?
                            // <input
                            // checked={currentProduct?.id === treatment.id}
                            // className='accordion-checkbox-details iv-therapy-checkbox'
                            // style={{cursor:'pointer'}}
                            //   type={'radio'}
                            //   name={`userData[${index}].line_items[${index}].product_id`}
                            //   value={treatment.id}
                            //   onChange={e => {
                            //     if (e.target.checked) {
                            //         setCurrentProduct(treatment);
                            //         setlineItems([...lineItems,{
                            //             userIndex: index,
                            //             price:treatment?.price,
                            //             product_id: treatment.id,
                            //             productName: treatment?.name,
                            //             quantity: 1,
                            //             metaData: []
                            //         }]);
                            //     } else {
                            //         setlineItems(lineItems.filter(item => item.product_id !== treatment.id));
                            //     }
                            // }}
                            // />
                            // <input
                            // className='accordion-checkbox-details'
                            // style={{cursor:'pointer'}}
                            //   type="checkbox"
                            //   name={`userData[${index}].line_items[${index}].product_id`}
                            //   value={treatment.id}
                            //   checked={lineItems.some(item => item.product_id === treatment.id)}
                            //   onChange={e => {
                            //     if (e.target.checked) {
                            //         setlineItems([...lineItems,{
                            //            userIndex: index,
                            //             product_id: treatment.id,
                            //             productName: treatment?.name,
                            //             price: treatment?.price,
                            //             quantity: 1,
                            //             metaData: []
                            //         }]);
                            //     } else {
                            //       console.log({
                            //         targetValue:e.target.value,
                            //         currentProduct:currentProduct?.id,
                            //       })
                            //         setlineItems(lineItems.filter(item => item.product_id !== treatment.id));
                            //     }
                            // }}
                            // />
                            
                            // :
                            <input
                          className='accordion-checkbox-details'
                          style={{cursor:'pointer'}}
                            type="checkbox"
                            name={`userData[${index}].line_items[${index}].product_id`}
                            value={treatment.id}
                            // checked={lineItems.some(item => index===0&&item.product_id === treatment.id)}
                            checked={lineItems.some(item=>index===item.userIndex&&item.product_id===treatment.id)}
                            defaultChecked={lineItems.some(item=>index===0&&item.product_id===treatment.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                  setlineItems([...lineItems,{
                                     userIndex: index,
                                      product_id: treatment.id,
                                      productName: treatment?.name,
                                      price: treatment?.price,
                                      quantity: 1,
                                      metaData: []
                                  }]);
                              } else {
                                  setlineItems(lineItems.filter(item => item.product_id !== treatment.id));
                              }
                          }}
                          />}
                          {treatment?.name}
                          </div>
                          {/* price */}
                          <div className='accordion-item-price'
                          >
                            <p className='price-tag'>
                           $ {treatment?.price}
                            </p>
                          </div>
                          </div>
                        </div>
                      ))}
                      </div>
                      </TwistAccordion>
                      </>
  )
}

export default ChooseTreatments