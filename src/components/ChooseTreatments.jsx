import React from 'react'
import TwistAccordion from '../Accordion/AccordionComponent';

function ChooseTreatments({
    index,
    lineItems,
    setlineItems,
    selectNad
}) {
  return (
    <>
    <TwistAccordion title="Section 1">
                        {selectNad.map(nadItem => (
                        <label key={nadItem.id}>
                          <input
                          style={{cursor:'pointer'}}
                            type="checkbox"
                            name={`userData[${index}].line_items[${index}].product_id`}
                            value={nadItem.id}
                            onChange={e => {
                              if (e.target.checked) {
                                  setlineItems([...lineItems,{
                                     userIndex: index,
                                      productId: nadItem.id,
                                      quantity: 1,
                                      metaData: []
                                  }]);
                              } else {
                                  setlineItems(lineItems.filter(item => item.productId !== nadItem.id));
                              }
                          }}
                          />
                          {nadItem.name}
                        </label>
                      ))}
                      </TwistAccordion>
                      </>
  )
}

export default ChooseTreatments