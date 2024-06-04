import '../paymentMethod.css';
import CustomInput from '../CustomInput';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

function CardPaymentMethod({ values }) {
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardNumberElement);


  values.cardNumberElement = {stripe,elements,cardElement};

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        iconColor: 'black',
        color: 'black',
        fontSize: '18px',
        fontFamily: 'Raleway, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'black',
        },
      },
      invalid: {
        iconColor: '#fa004f',
        color: '#fa004f',
      },
    },
  };

  return (
    <>
      {values.paymentMethod === 'creditCard' && (
        <div className="card-elements">
          <div className="card-number">
            <label className="card-label">Card number</label>
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              class="card-number-input"
            />
          </div>

          <div className="card-info">
            <div className="expiry-date">
              <label className="card-label">Expiration</label>
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="cvc">
              <label className="card-label">CVC</label>
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
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
