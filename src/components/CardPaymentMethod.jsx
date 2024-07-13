import '../paymentMethod.css';
import PropTypes from 'prop-types';
import CustomInput from '../CustomInput';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import useLocationAutoComplete from '../hooks/LocationAutoCompleteHolder';
import PlacesAutocomplete from 'react-places-autocomplete';

function CardPaymentMethod({ values, isScriptLoaded }) {
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardNumberElement);

  values.cardNumberElement = { stripe, elements, cardElement };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        iconColor: 'black',
        color: 'black',
        fontSize: '18px',
        fontFamily: 'Raleway, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#c6c6c6',
          fontSize: '15px',
          fontWeight: 'normal',
        },
      },
      invalid: {
        iconColor: '#fa004f',
        color: '#fa004f',
      },
    },
  };

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const {
    address,
    handleChange,
    handleSelect,
    handleAddressBlur,
    handleStateChange,
    handleZipChange,
    formattedAddress,
  } = useLocationAutoComplete();

  const { address: extractedAddress, city, state, zip } = address || {};

  useEffect(() => {
    if (extractedAddress) {
      setFieldValue('biller_details.address.line1', extractedAddress);
      setFieldTouched('biller_details.address.line1', true);
    }
    if (city) {
      setFieldValue('biller_details.address.city', city);
    }
    if (state) {
      setFieldValue('biller_details.address.state', state);
    }
    if (zip) {
      setFieldValue('biller_details.address.postal_code', zip);
    }
  }, [extractedAddress, city, state, zip, setFieldValue, setFieldTouched]);

  return (
    <>
      {values.paymentMethod === 'creditCard' && (
        <div>
          <div className="card-elements">
            {/* holder name and address */}
            <div className="card_number_expiry_wrapper">
              <div className="card-number">
                <label className="card-label in-product-page">Card number</label>
                <CardNumberElement
                  options={{ ...CARD_ELEMENT_OPTIONS, placeholder: '1234 - 4567 - 8901 - 2345' }}
                  name="cardNumber"
                  className="card-number-input"
                />
                <ErrorMessage
                  name="cardNumber"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="card-info">
                <div className="expiry-date">
                  <label className="card-label in-product-page">Expiration</label>
                  <CardExpiryElement options={CARD_ELEMENT_OPTIONS} name="card_number" />
                </div>
                <div className="cvc">
                  <label className="card-label in-product-page">CVC</label>
                  <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>
            <div className="holder-info holder_name_billing_parent">
              <div className="card-holder-name">
                <CustomInput
                  label="Card Holder Name"
                  name="biller_details.name"
                  value={values.biller_details.name}
                  type="text"
                  placeholder="Card Holder Name"
                  className="card-holder-name-input"
                />
              </div>
            </div>

            {/* Billing address */}
            <div className="billing-container">
              <div className="card-holder-billing">
                {!isScriptLoaded ? (
                  <h1>...loading</h1>
                ) : (
                  <PlacesAutocomplete
                    value={
                      typeof address === 'string'
                        ? address
                        : extractedAddress || formattedAddress
                    }
                    onChange={handleChange}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <>
                        <h2 className='billing-header-text'>Billing Address</h2>
                        <CustomInput
                          label="Street Address"
                          className="card-holder-billing-address-input country-container"
                          name="biller_details.address.line1"
                          type="text"
                          placeholder="Country"
                          {...getInputProps({
                            placeholder: '4579 Norman Street',
                            className: 'location-search-input',
                            onBlur: handleAddressBlur,
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
                        <div className="state-city-wrapper">
                          <div className="holder-info country_zip_parent">
                            <div className="card-holder-billing zip-and-state">
                              <CustomInput
                                label="City"
                                className="card-holder-billing-address-input"
                                name="biller_details.address.city"
                                value={values.biller_details.address.city}
                                type="text"
                                placeholder="City"
                              // onChange={handleCityChange}
                              />
                              <CustomInput
                                label="State"
                                className="card-holder-state-address-input"
                                name="biller_details.address.state"
                                value={values.biller_details.address.state}
                                type="text"
                                placeholder="State"
                                onChange={handleStateChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="street-address-line">
                          <CustomInput
                            label="Country"
                            name="biller_details.address.country"
                            type="text"
                            placeholder="USA"
                            value={values.biller_details.address.country}
                            className="card-holder-name-input"
                          />
                        </div>
                        <div className="street-address-line">
                          <CustomInput
                            label="Address Line 2"
                            name="biller_details.address.address_line_2"
                            type="text"
                            placeholder="Street Address 2"
                            value={values.biller_details.address.address_line_2}
                            className="card-holder-name-input"
                          />
                        </div>
                        <div className="zip-wrapper">
                          <div className="card-holder-billing zip-and-state">
                            <CustomInput
                              label="Zip"
                              className="card-holder-billing-address-input zip-input"
                              name="biller_details.address.postal_code"
                              value={values.biller_details.address.postal_code}
                              type="text"
                              placeholder="90008"
                              onChange={handleZipChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </PlacesAutocomplete>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
      <CustomInput
        label="Special Instructions: "
        name="specialInstructions"
        type="textArea"
        placeholder="Anything Else We Should Know? (i.e parking, entry, time flexibility, pets)"
      />
    </>
  );
}

export default CardPaymentMethod;

CardPaymentMethod.propTypes = {
  values: PropTypes.object.isRequired,
  isScriptLoaded: PropTypes.bool.isRequired,
};