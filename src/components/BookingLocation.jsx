import '../bookingLocationStyle.css';
import propTypes from 'prop-types';
import { ErrorMessage, Field, useField, useFormikContext } from 'formik';
import CustomInput from '../CustomInput';
import PlacesAutocomplete from 'react-places-autocomplete';
import useLocationAutoComplete from '../hooks/LocationAutoComplete';
import { useEffect } from 'react';
import { getProductPrice } from '../utils/getProductPrice';

function BookingLocation({ values, isScriptLoaded,currentProduct,lineItems,nadChoices,setLineItems }) {
  const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    const {bookHouseCall} = getProductPrice({product: currentProduct});

  if (bookingData) {
    values.clinicChoice = bookingData && bookingData?.bookingChoice === 'atourclinics' && bookingData?.bookingAddress;
    values.bookingChoice = bookingData && bookingData?.bookingChoice === 'housecall' && 'housecall' || 'atourclinics';
    values.bookingAddress = bookingData && bookingData?.bookingChoice === 'housecall' && bookingData?.bookingAddress;
    if (bookingData?.bookingChoice === 'housecall') {
      values.bookingAddress.address_1 = bookingData?.bookingAddress?.address_1 ?? '';
    }
    // values.bookingChoice = bookingData && bookingData?.bookingChoice || 'atourclinics';
  }
  const { address, handleChange, handleSelect, formattedAddress } =
    useLocationAutoComplete();
  const { address: extractedAddress, city, state, zip } = address || {};
  const { setFieldValue, setFieldTouched } = useFormikContext();
  useEffect(() => {
    if (extractedAddress) {
      setFieldValue('bookingAddress.address_1', extractedAddress);
      setFieldTouched('bookingAddress.address_1', true);
    }
    if (city) {
      setFieldValue('bookingAddress.city', city);
    }
    if (state) {
      setFieldValue('bookingAddress.state', state);
    }
    if (zip) {
      setFieldValue('bookingAddress.postcode', zip);
    }
  }, [extractedAddress, city, state, zip, setFieldValue, setFieldTouched]);

  const variations = nadChoices?.[0]?.variations?.reduce((acc, variation) => {
    const { id, name, price, image, permalink } = variation || {};
    const nadName = name?.match(/NAD\+ \d+mg - .+?, (NAD\+ \d+mg)/)?.[1];
    const type = permalink?.includes('attribute_type=House') ? 'priceHouseCall' : 'priceClinic';

    let nadObject = acc.find(item => item.name === nadName);

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

  const lineNadItem = lineItems?.find(item => item?.productName?.toLowerCase().includes('nad'));
  
  const foundVariation = variations?.find(v => 
    v.variation.some(vari => vari.id === lineNadItem?.variation_id)
);

  useEffect(() => {
    if (values?.bookingChoice === 'atourclinics') {
      setFieldValue('clinicChoice', 'Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403');
      setFieldTouched('clinicChoice', true);
    } else {
      setFieldValue('clinicChoice', '');
      setFieldTouched('clinicChoice', false);
    }

    setLineItems(prevLineItems => {
      const updatedLineItems = prevLineItems.map(item => {
        if (item.productName?.toLowerCase()?.includes('nad')) {
          const inHousePrice = foundVariation?.variation?.find(v => v.priceHouseCall)?.priceHouseCall || null;
          const bookInClinic = foundVariation?.variation?.find(v => v.priceClinic)?.priceClinic || null;
          const houseVariation = foundVariation?.variation?.find(v => v.priceHouseCall) || null;
          const clinicVariation = foundVariation?.variation?.find(v => v.priceClinic) || null;
          const houseCallId = houseVariation?.id || null;
          const clinicId = clinicVariation?.id || null;
    
          return {
            ...item,
            price: values?.bookingChoice === 'housecall' ? inHousePrice : bookInClinic,
            product_id: values?.bookingChoice === 'housecall' ? houseCallId : clinicId,
            variation_id: values?.bookingChoice === 'housecall' ? houseCallId : clinicId
          }
        }
        return item;
      });
      return updatedLineItems;
    });

  },[setFieldTouched, setFieldValue, values?.bookingChoice]);

  const handleClinicChoiceBlur = () => {
    setFieldTouched('clinicChoice', true);
  };

  const [field] = useField('clinicChoice');
  return (
    <div className="the-single-product selection_wrapper">
      <div className="the-single-product-page selection-wrapper single-page-location">
        <div className="choose-radio-wrapper">
          <div className="where-span">
            <div
              className="radio-circle"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Field
                className="location-radios"
                type="radio"
                name="bookingChoice"
                value="atourclinics"
              />
            </div>
            <p className="location-where"
              onClick={() => setFieldValue('bookingChoice', 'atourclinics')}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              Rejuve Clinics
              {' '}
              <span className="location-span"> &#160; At our locations</span>
            </p>
          </div>
        </div>
        <div className="choose-radio-wrapper">
          <div
            className="where-span"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="radio-circle">
              <Field
                className={`location-radios ${!bookHouseCall && 'disabled'}`}
                type="radio"
                name="bookingChoice"
                value="housecall"
                checked={values.bookingChoice === 'housecall'}
                disabled={!bookHouseCall && true || false}
              />
            </div>
            <p 
              className={`location-where ${!bookHouseCall && 'disabled'}`}
              onClick={() => bookHouseCall && setFieldValue('bookingChoice', 'housecall')|| null}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              House Call
              {' '}
              <span className={`location-span ${!bookHouseCall && 'disabled'}`}>
                &#160;    We come to you</span>
            </p>
          </div>
        </div>
      </div>
      {(values?.bookingChoice === 'atourclinics' && (
        <div className="select-clinic-wrapper tooltip-wrapper">
          <p className="tooltip-text">Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403</p>
          <select
            className="select-location-dropdown"
            id="clinic-location-dropdown"
            name="clinicChoice"
            // disabled
            value={field.value}
            style={{cursor:'pointer'}}
            onChange={field.onChange}
            onBlur={handleClinicChoiceBlur}
            onClick={handleClinicChoiceBlur}
          >
            <option
              className="select-location-dropdown"
              value="Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403"
            >
              Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403
            </option>
          </select>
          <img
            className="location-icon"
            src="http://rejuve.com/wp-content/uploads/2024/05/location-icon-1.svg"
          />
          <img
            className="drop-down-icon"
            src="http://rejuve.com/wp-content/uploads/2024/05/arrow-down.svg"
          />
          <ErrorMessage
            name="clinicChoice"
            component="div"
            className="error-clinic-selection input-box-error-message"
          />
        </div>
      )) ||
        (
          values?.bookingChoice === 'housecall' && !isScriptLoaded ? <h1>...loading</h1> :
            <div className="address-wrapper">
              <div className="top-level-addresses-wrapper">
                <PlacesAutocomplete
                  value={
                    typeof address === 'string'
                      ? address
                      : extractedAddress || formattedAddress
                  }
                  onChange={(address) => {
                    handleChange(address);
                    // Remove bookingData from localStorage when the user starts typing
                    localStorage.removeItem('bookingData');
                  }}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div className="address_wrapper">

                      <CustomInput
                        label="Your Address"
                        name="bookingAddress.address_1"
                        type="text"
                        {...getInputProps({
                          placeholder: 'Search Places ...',
                          className: 'location-search-input',
                          onBlur: () =>
                            setFieldTouched('bookingAddress.address_1', true),
                          // Add onInput handler to remove bookingData from localStorage
                          onInput: () => localStorage.removeItem('bookingData'),
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? 'suggestion-item--active input-box'
                            : 'suggestion-item input-box';
                          const style = suggestion.active
                            ? {
                              backgroundColor: '#fafafa',
                              cursor: 'pointer',
                              color: '#000',
                            }
                            : {
                              backgroundColor: '#ffffff',
                              cursor: 'pointer',
                              color: '#000',
                            };
                          return (
                            <div
                              key={suggestion.placeId}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <CustomInput
                  label="Your Address 2"
                  placeholder="4579 Norman Street"
                  name="bookingAddress.address_2"
                  type="text"
                />
              </div>
              <div className="zip-city-wrapper" style={{ display: 'flex' }}>
                <CustomInput
                  cityStateZip
                  label="City"
                  name="bookingAddress.city"
                  type="text"
                  placeholder="Los Angeles"
                  value={city || values.bookingAddress.city}
                />
                <CustomInput
                  cityStateZip
                  label="State"
                  placeholder="California"
                  name="bookingAddress.state"
                  type="text"
                  value={state || values.bookingAddress.state}
                />
                <CustomInput
                  cityStateZip
                  label="zipcode"
                  placeholder="90008"
                  name="bookingAddress.postcode"
                  type="text"
                  value={zip || values.bookingAddress.postcode}
                />
              </div>
            </div>
        )}
    </div>
  );
}

export default BookingLocation;

BookingLocation.propTypes = {
  values: propTypes.object.isRequired,
  isScriptLoaded: propTypes.bool,
  currentProduct: propTypes.object.isRequired,
  lineItems: propTypes.array
};
