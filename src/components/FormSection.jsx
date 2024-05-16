import { Field, FieldArray, Form, Formik } from "formik"
import { handleValidation } from "../Validation"
import { initialValues } from "../initialValues"
import UserDetail from "./UserDetail"
import Providers from "./Providers"
import BookingDateTime from "./BookingDateTime"
import AlmostDoneSection from "./AlmostDone"
import CardPaymentMethod from "./CardPaymentMethod"
import Agreement from "./Agreement"
import { useState } from "react"
import ChooseTreatments from "./ChooseTreatments"
import BookingLocation from "./BookingLocation"
import ProductHero from "./ProductHero"

function FormSection({
  lineItems,
  setlineItems,
  treatments,
  providers,
  selectedProvider,
  handleProviderChange,
  handleCustomTipChange,
  handlePercentageChange,
  defaultTip,
  calculatedTipAmount,
  selectNad,
  updateForm,
  fieldsAreEmpty,
  fieldsAreEmptyForUpdate,
  removeFromList,
  submitForm,
  handleSubmit,
  isFetchingProduct,
currentProduct,
setProductPrice
}) {
   const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  return (
    <>
     <Formik
        validationSchema={handleValidation}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => (
          <Form>
            <>
            <ProductHero
              isFetchingProduct={isFetchingProduct}
              currentProduct={currentProduct}
              setProductPrice={setProductPrice}
              values={values}
            />
            </>
            </Form>
        )}
      </Formik>
    </>
  )
}

export default FormSection