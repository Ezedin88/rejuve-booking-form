import propTypes from 'prop-types';
import TwistAccordion from '../Accordion/AccordionComponent';
import { getProductPrice } from '../utils/getProductPrice';

function ChooseTreatments({
  index,
  lineItems,
  setlineItems,
  treatmentChoices,
  ivTherapy,
  setCurrentProduct,
  isDecolettage,
  dataValues
}) {

  // when not iv therapy
  const handleCheckboxChangeNotIvTherapy = (checked, treatment, inHousePrice) => {
    if (checked) {
      setlineItems([...lineItems, {
        userIndex: index,
        product_id: treatment.id,
        productName: treatment?.name,
        price: dataValues?.bookingChoice === 'housecall' ? inHousePrice : treatment?.price,
        quantity: 1,
        metaData: []
      }]);
    } else {
      setlineItems(lineItems.filter(item => item.product_id !== treatment.id));
    }
  };
  // when iv therapy
  const handleCheckboxChangeIvTherapy = (checked, treatment, inHousePrice) => {
    if (checked) {
      // for hero profile image
      if (index === 0 && !isDecolettage) {
        setCurrentProduct(treatment);
      }
      setlineItems(prevLineItems => {
        const ivTreatmentIds = treatmentChoices
          .filter(treatment => treatment.categories[0] === 'IV Treatment')
          .map(treatment => treatment.id);
        const remainingLineItems = prevLineItems.filter(item => {
          if (item.userIndex !== index) {
            return true;
          }
          return !ivTreatmentIds.includes(item.product_id);
        });
        return [
          ...remainingLineItems,
          {
            userIndex: index,
            price: dataValues?.bookingChoice === 'housecall' ? inHousePrice : treatment?.price,
            product_id: treatment.id,
            productName: treatment?.name,
            quantity: 1,
            metaData: []
          }
        ];
      });
    }
  };

  return (
    <>
      <TwistAccordion title={treatmentChoices?.[0]?.categories?.[0]}
        userIndex={index}
        lineItems={lineItems}
        setLineItems={setlineItems}
        treatmentChoices={treatmentChoices}
      >
        <div className='treatments-wrapper'>
          {treatmentChoices?.map(treatment => {

         const {price,variations} = treatment ||{};             
        const inHousePrice = parseFloat(variations?.[1]?.price) || parseFloat(price);
        const bookInClinic = parseFloat(variations?.[0]?.price) || parseFloat(price);
        
            return (
              <div key={treatment.id} className='check-box-price-wrapper'>
                <div className='accordion-inner-wrapper'>
                  <div className="checkbox-title">
                    {
                      ivTherapy ?
                        <input
                          className='accordion-checkbox-details iv-therapy-checkbox'
                          style={{ cursor: 'pointer' }}
                          type={'radio'}
                          name={`userData[${index}].line_items[${index}].product_id`}
                          value={treatment.id}
                          checked={lineItems.some(item => index === item.userIndex && item.product_id === treatment.id)}
                          onChange={
                            (e) => {
                              handleCheckboxChangeIvTherapy(e.target.checked, treatment, inHousePrice)
                            }
                          }
                        />
                        :
                        <input
                          className='accordion-checkbox-details'
                          style={{ cursor: 'pointer' }}
                          type="checkbox"
                          name={`userData[${index}].line_items[${index}].product_id`}
                          value={treatment.id}
                          checked={lineItems.some(item => index === item.userIndex && item.product_id === treatment.id)}
                          onChange={
                            (e) => {
                              handleCheckboxChangeNotIvTherapy(e.target.checked, treatment, inHousePrice)
                            }
                          }
                        />}
                    <p
                      onClick={() => !ivTherapy && handleCheckboxChangeNotIvTherapy(!lineItems.some(item => index === item.userIndex && item.product_id === treatment.id), treatment, inHousePrice)||
                      ivTherapy && handleCheckboxChangeIvTherapy(!lineItems.some(item => index === item.userIndex && item.product_id === treatment.id), treatment, inHousePrice)
                      }
                      style={{cursor:'pointer',margin:0}}
                    >
                      {treatment?.name}
                    </p>
                  </div>
                  {/* price */}
                  <div className='accordion-item-price'
                  >
                    <p className='price-tag'>
                      $ {dataValues?.bookingChoice === 'housecall' && inHousePrice || bookInClinic}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </TwistAccordion>
    </>
  )
}

export default ChooseTreatments

ChooseTreatments.propTypes = {
  index: propTypes.number,
  lineItems: propTypes.array,
  setlineItems: propTypes.func,
  treatmentChoices: propTypes.array,
  ivTherapy: propTypes.bool,
  isFetchingProduct: propTypes.bool,
  setCurrentProduct: propTypes.func,
  isDecolettage: propTypes.bool,
  dataValues: propTypes.object
}