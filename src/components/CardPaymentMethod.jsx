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
            <CustomInput label="Special Instructions" name="specialInstructions" type="text" />
        </>
    )
}

export default CardPaymentMethod