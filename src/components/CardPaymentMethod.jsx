import '../paymentMethod.css';
import CustomInput from '../CustomInput';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
  AddressElement,

} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
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
        },
      },
      invalid: {
        iconColor: '#fa004f',
        color: '#fa004f',
      },
    },
  };

  const options = {
    mode: 'billing', autocomplete: {
      mode: "google_maps_api",
      apiKey: "AIzaSyBiMgA18QMFdnj67qadAYRk816SdI8c8ag",
    },
    fields: {
      Address: {
        label: 'Addres2222s',
      },

    }
  }

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { address, handleChange, handleSelect, formattedAddress } =
    useLocationAutoComplete();

  const { address: extractedAddress, city, state, zip } = address || {};

  useEffect(() => {
    if (extractedAddress) {
      setFieldValue('biller_details.line1', extractedAddress);
      setFieldTouched('biller_details.line1', true);
    }
    if (city) {
      setFieldValue('biller_details.city', city);
    }
    if (state) {
      setFieldValue('biller_details.state', state);
    }
    if (zip) {
      setFieldValue('biller_details.postal_code', zip);
    }
  }, [extractedAddress, city, state, zip, setFieldValue, setFieldTouched])

  return (
    <>
      {values.paymentMethod === 'creditCard' && (
        <div>
          <div className="card-elements">
            {/* holder name and address */}
            <div className="holder-info">
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
              <div className="card-holder-billing">
                {
                  !isScriptLoaded ? <h1>...loading</h1> :
                    <PlacesAutocomplete
                      value={
                        typeof address === 'string'
                          ? address
                          : extractedAddress || formattedAddress
                      }
                      onChange={handleChange}
                      onSelect={handleSelect}
                    >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <>
                          <CustomInput
                            label="Billing"
                            className="card-holder-billing-address-input"
                            name="biller_details.line1"
                            type="text"
                            placeholder="Billing Address"
                            {...getInputProps({
                              placeholder: 'Billing Address',
                              className: 'location-search-input',
                              onBlur: () =>
                                setFieldTouched('biller_details.line1', true),
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
                        </>
                      )}
                    </PlacesAutocomplete>
                } </div>
            </div>

            {/* country and zip */}
            <div className="holder-info">
              <div className="card-holder-name">
                <CustomInput
                  label="Country"
                  name="biller_details.address.country"
                  type="text"
                  placeholder="Country"
                  value={values.biller_details.address.country}
                  className="card-holder-name-input"
                />
              </div>
              <div className="card-holder-billing">
                <CustomInput
                  label="Zip"
                  className="card-holder-billing-address-input"
                  name="billing_address.address.postal_code"
                  value={values.biller_details.address.postal_code}
                  type="text"
                  placeholder="Zip"
                />
              </div>
            </div>

            <div className="card-number">
              <label className="card-label in-product-page">Card number</label>
              <CardNumberElement
                options={CARD_ELEMENT_OPTIONS}
                class="card-number-input"
              />
            </div>

            <div className="card-info">
              <div className="expiry-date">
                <label className="card-label in-product-page">Expiration</label>
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <div className="cvc">
                <label className="card-label in-product-page">CVC</label>
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
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
