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
setCurrentProduct,
setProductPrice
}) {
   const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  const selectAdons = treatments.filter(item => item.categories.some(category => category.slug === 'ad-ons'));
  const selectBooster = treatments.filter(item => item.categories.some(category => category.slug === 'booster'));
  const selectVitaminInjections = treatments.filter(item => item.categories.some(category => category.slug === 'vitamin-injections'));
  const selectAdvancedTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'advanced-therapies'));
  const selectIvTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'iv-treatment'));

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
            <FieldArray name="userData">
              {() =>
                values.userData.map((item, index) => {
                  return (
                    <div key={index}>
                      {/* button to remove added item */}
                      {
                        values.userData.length > 1 && (
                          <button type="button" onClick={() => removeFromList(index, values, setValues)}>Remove</button>
                        )
                      }
                      <div>
                        <UserDetail index={index} />
                      </div>
                      <div style={{padding:'0 15px'}}>
                        <ChooseTreatments
                          treatmentChoices={selectIvTherapies}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectIvTherapies?.[0]?.categories[0]?.name}
                          ivTherapy
                          currentProduct={currentProduct}
                          setCurrentProduct={setCurrentProduct}
                          />

                        <ChooseTreatments
                          treatmentChoices={selectNad}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectNad?.[0]?.categories[0]?.name} />
                           <ChooseTreatments
                          treatmentChoices={selectAdons}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectAdons?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                          treatmentChoices={selectBooster}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectBooster?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                          treatmentChoices={selectVitaminInjections}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectVitaminInjections?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                          treatmentChoices={selectAdvancedTherapies}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectAdvancedTherapies?.[0]?.categories[0]?.name} />
                      </div>
                      <>
              <BookingLocation
                index={index}
                values={values}
              />
              </>
                    </div>
                  )
                })
              }

            </FieldArray>
            <h1>Choose Provider</h1>
            {/* any input option */}
            <Providers
              providers={providers}
              handleProviderChange={handleProviderChange}
              selectedProvider={selectedProvider}
              values={values}
            />
            {/* booking date and time preference */}
            <BookingDateTime />
            {/* almost done */}
            <>
             
             <AlmostDoneSection
              calculatedTipAmount={calculatedTipAmount}
              handleCustomTipChange={handleCustomTipChange}
              handlePercentageChange={handlePercentageChange}
              defaultTip={defaultTip}
              values={values}
              setValues={setValues}
            />
            </>
            <div>
              <label>
                <Field type="radio" name="paymentMethod" value="creditCard" />
                Credit Card
              </label>
              <label>
                <Field type="radio" name="paymentMethod" value="payAtLocation" />
                Pay at Location
              </label>
            </div>
           {/* Payment Method */}
           <CardPaymentMethod 
            values={values}
           />
           <Agreement
            agreeToTos={agreeToTos}
            setAgreeToTos={setAgreeToTos}
            agreeToCreateAccount={agreeToCreateAccount}
            setAgreeToCreateAccount={setAgreeToCreateAccount}
            agreeToSignUp={agreeToSignUp}
            setAgreeToSignUp={setAgreeToSignUp}
           />
              
            <button type="button"
              onClick={() => updateForm(values, setValues)}>Add User</button>
            {fieldsAreEmptyForUpdate && <small style={{ color: 'red', fontSize: '16px' }}>Please fill all fields</small>}
            <button type="submit" onClick={()=>submitForm(values)}>Submit</button>
            {fieldsAreEmpty && <small style={{ color: 'red', fontSize: '16px' }}>Please fill all fields</small>}
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FormSection