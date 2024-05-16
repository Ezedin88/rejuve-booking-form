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
  console.log(currentProduct)
  return (
    <>
    <TwistAccordion title={treatmentChoices?.[0]?.categories?.[0]?.name}>
      <div className='treatments-wrapper'>
                        {treatmentChoices.map(treatment => (
                        <div key={treatment.id} className='check-box-price-wrapper'>
                          <div className='accordion-inner-wrapper'>
                          <div className="checkbox-title">
                            {
                              ivTherapy?
                            <input
                            className='accordion-checkbox-details iv-therapy-checkbox'
                            style={{cursor:'pointer'}}
                              type={'radio'}
                              name={`userData[${index}].line_items[${index}].product_id`}
                              value={treatment.id}
                              onChange={e => {
                                if (e.target.checked) {
                                    setCurrentProduct(treatment);
                                    setlineItems([...lineItems,{
                                       userIndex: index,
                                        productId: treatment.id,
                                        quantity: 1,
                                        metaData: []
                                    }]);
                                } else {
                                    setlineItems(lineItems.filter(item => item.productId !== treatment.id));
                                }
                            }}
                            />:
                          <input
                          className='accordion-checkbox-details'
                          style={{cursor:'pointer'}}
                            type="checkbox"
                            name={`userData[${index}].line_items[${index}].product_id`}
                            value={treatment.id}
                            onChange={e => {
                              if (e.target.checked) {
                                  setlineItems([...lineItems,{
                                     userIndex: index,
                                      productId: treatment.id,
                                      quantity: 1,
                                      metaData: []
                                  }]);
                              } else {
                                  setlineItems(lineItems.filter(item => item.productId !== treatment.id));
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