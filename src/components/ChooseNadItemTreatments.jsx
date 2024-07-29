import propTypes from 'prop-types';

function ChooseNadItemTreatments({
  index,
  lineItems,
  treatmentChoices,
  dataValues,
  setLineItems,
  setCurrentProduct,
  currentProduct,
}) {
  const nadTreatmentChoices = treatmentChoices?.[0]?.variations?.reduce((acc, variation) => {
    const { id, name, price, image, permalink } = variation||{};
    const nadName = name?.match(/NAD\+ \d+mg - .+?, (NAD\+ \d+mg)/)?.[1];
    const type = permalink.includes('attribute_type=House') ? 'priceHouseCall' : 'priceClinic';

    let nadObject = acc?.find(item => item.name === nadName);

    if (!nadObject) {
      nadObject = {
        name: nadName,
        image,
        variation: [],
      };
      acc.push(nadObject);
    }

    if (permalink.includes('attribute_type=House')) {
      nadObject.id = id; // Update id if permalink includes attribute_type=House
    }

    nadObject.variation.push({ id, [type]: price, permalink });

    return acc;
  }, []);

  const productIsHouseCall = dataValues?.bookingChoice === 'housecall';
  return (
    <div className='treatments-wrapper'>
      {nadTreatmentChoices?.map(treatment => {

        const { variation } = treatment || {};
        const inHousePrice = variation?.find(v => v.priceHouseCall)?.priceHouseCall;
        const bookInClinic = variation?.find(v => v.priceClinic)?.priceClinic;
        const houseVariation = variation?.find(v => v.priceHouseCall);
        const clinicVariation = variation?.find(v => v.priceClinic);
        const houseCallId = houseVariation?.id;
        const clinicId = clinicVariation?.id;
        const refactoredItem = {
          metaData: [],
          price: productIsHouseCall ? inHousePrice : bookInClinic,
          product_id: productIsHouseCall ? houseCallId : clinicId,
          quantity: 1,
          productName: treatment.name,
          userIndex: index,
          variation_id: productIsHouseCall ? houseCallId : clinicId
        }

        const handleNadCheckboxChange = (treatment) => {
          const updatedCurrentProductItem = {
            ...currentProduct,
            userIndex: index,
            acf: currentProduct?.acf,
            id: productIsHouseCall ? houseCallId : clinicId, 
            image: currentProduct?.image,
            name: treatment?.productName,
            permalink: currentProduct?.variations?.find(v => v.id === treatment?.variation_id)?.permalink,
            price: treatment?.price,
            variations: currentProduct?.variations
          }
          
          setLineItems(prevLineItems=>{
            const remainingLineItems = prevLineItems.filter(item=>{
              if(item.userIndex !==index){
                return true;
              }
              return !item.productName.toLowerCase().includes('nad');
            });
            return [
              ...remainingLineItems,
              {...treatment,userIndex:index}
            ]
          });
          if (index === 0) {
            setCurrentProduct(updatedCurrentProductItem);
          }
        }
        
        return (
          <div key={treatment.id} className='check-box-price-wrapper'>
            <div className='accordion-inner-wrapper'>
              <div className="checkbox-title">
                {
                  <input
                    className='accordion-checkbox-details iv-therapy-checkbox'
                    style={{ cursor: 'pointer' }}
                    type="radio"
                    name={`userData[${index}].line_items[${index}].product_id`}
                    value={treatment.id}
                    checked={lineItems.some(item => index === item.userIndex && item.productName === treatment.name)}
                    onChange={() => handleNadCheckboxChange(refactoredItem)}
                  />}
                <p
                  onClick={() => handleNadCheckboxChange(refactoredItem)
                  }
                  style={{ cursor: 'pointer', margin: 0 }}
                >
                  {treatment?.name}
                </p>
              </div>
              {/* price */}
              <div className='accordion-item-price'
              >
                <p className='price-tag'>
                  $ {productIsHouseCall && inHousePrice || bookInClinic}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChooseNadItemTreatments;

ChooseNadItemTreatments.propTypes = {
  index: propTypes.number,
  lineItems: propTypes.array,
  treatmentChoices: propTypes.array,
  dataValues: propTypes.object,
  setLineItems: propTypes.func,
  setCurrentProduct: propTypes.func,
  currentProduct: propTypes.object
}