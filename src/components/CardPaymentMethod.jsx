import '../paymentMethod.css';
import CustomInput from "../CustomInput"
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

function CardPaymentMethod({ values }) {
    const elements = useElements();
    const cardElement = elements?.getElement(CardNumberElement);
    values.theCardElement = cardElement;
    const stripe = useStripe();
    console.log('the element==>',cardElement);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                iconColor: "black",
                color: "black",
                fontSize: "18px",
                fontFamily: "Raleway, sans-serif",
                fontSmoothing: "antialiased",
                "::placeholder": {
                    color: "black",
                },
            },
            invalid: {
                iconColor: "#fa004f",
                color: "#fa004f",
            },
        },
    };


    

    return (
        <>
            {values.paymentMethod === 'creditCard' && (
                <>
                    <CardNumberElement
                        options={CARD_ELEMENT_OPTIONS}
                    />
                    <CardExpiryElement
                        options={CARD_ELEMENT_OPTIONS}
                    />
                    <CardCvcElement
                        options={CARD_ELEMENT_OPTIONS}
                    />
                </>
            )}
            <CustomInput
                label="Special Instructions: " name="specialInstructions" type="textArea"
                placeholder='Anything Else We Should Know? (i.e parking, entry, time flexibility, pets)'
            />
        </>
    )
}

export default CardPaymentMethod