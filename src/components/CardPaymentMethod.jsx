import '../paymentMethod.css';
import CustomInput from "../CustomInput"

function CardPaymentMethod({values}) {
    return (
        <>
            {values.paymentMethod === 'creditCard' && (
                <>
                    <CustomInput label="Card Number" name="cardNumber" type="text" />
                    <CustomInput label="Expiration" name="expiration" type="text" />
                    <CustomInput label="CVV" name="cvv" type="text" />
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