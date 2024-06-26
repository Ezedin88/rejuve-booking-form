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

function CardPaymentMethod({ values }) {
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

  const options = {mode:'billing',autocomplete:{
    mode: "google_maps_api",
    apiKey: "AIzaSyBiMgA18QMFdnj67qadAYRk816SdI8c8ag",
  },
  fields:{
    Address:{
      label:'Addres2222s',
    },
    
  }
}

const {setFieldValue} = useFormikContext();
  return (
    <>
      {values.paymentMethod === 'creditCard' && (
        <div>
        <div className="card-elements">
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
            <div className="address" style={{marginTop:'20px'}}>
              <AddressElement options={options} 
              onChange={(event)=>{
                if(event.complete){
                  const addressData = event.value;
                  setFieldValue('biller_details.name',addressData.name);
                  setFieldValue('biller_details.line1',addressData.address.line1);
                  setFieldValue('biller_details.line2',addressData.address.line2??"");
                  setFieldValue('biller_details.city',addressData.address.city);
                  setFieldValue('biller_details.state',addressData.address.state);
                  setFieldValue('biller_details.postal_code',addressData.address.postal_code);
                }
              }}/>
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
