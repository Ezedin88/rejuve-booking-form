import '../mainStyles.css';
import { Field, FieldArray, Form, Formik, useFormikContext,setNestedObjectValues } from "formik"
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
import CustomInput from '../CustomInput';

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
  setProductPrice,
  setWhereBooking,
  whereBooking,
  currentMainProduct,
  heroCurrentProduct,
  tips
}) {
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  const selectAdons = treatments.filter(item => item.categories.some(category => category.slug === 'ad-ons'));
  const selectBooster = treatments.filter(item => item.categories.some(category => category.slug === 'booster'));
  const selectVitaminInjections = treatments.filter(item => item.categories.some(category => category.slug === 'vitamin-injections'));
  const selectAdvancedTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'advanced-therapies'));
  const selectIvTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'iv-treatment'));
  const currentProductPrice = Number(currentProduct?.price) || 0;
  const totalCalculation = lineItems.reduce((acc, item) => acc + Number(item.price), 0);
  const [refactoredErrors, setRefactoredErrors] = useState([]);
  const [termsError,setTermsError] = useState(false);
  const [hasAnyErrors,setHasAnyErrors] = useState(false);
const [hasUserDataErrors, setHasUserDataErrors] = useState(false);
  return (
    <>
      <Formik
        validationSchema={handleValidation}
        initialValues={initialValues}
        validateOnChange
        validateOnBlur
        onSubmit={handleSubmit}
      >
        {({ values, errors, setValues,setTouched,validateForm,isValid }) => {
           const hasErrors = Object.keys(errors).filter(key => key !== 'terms').length > 0;
           if (!hasErrors) {
             setHasAnyErrors(false);
           }
           console.log('values==>',values)
          const { terms: termsError, userData: userDataErrors } = errors || {};
          const areThereUserDataErrors = userDataErrors && userDataErrors.length > 0;

          const checkForAnyErrors = async () => {
            setTouched(setNestedObjectValues(values, true));
            const formErrors = await validateForm();
            const filteredFormErrors = Object.keys(formErrors).filter(key => key !== 'terms').reduce((obj, key) => {
              obj[key] = formErrors[key];
              return obj;
            }, {});
            const hasErrors = filteredFormErrors && Object.keys(filteredFormErrors).length > 0;
            setHasUserDataErrors(hasErrors);
            return hasErrors;
          };

    const handleAddUserValidation = async () => {
      const formErrors = await validateForm();
      const { userData:userDataErrors,bookingAddressErrors,clinicChoiceErrors } = formErrors||{};
        const userErrorExists = userDataErrors && Object.keys(userDataErrors).length > 0||bookingAddressErrors && Object.keys(bookingAddressErrors).length > 0||clinicChoiceErrors;
        setHasUserDataErrors(userErrorExists);
        return userErrorExists;
    };

    const checkAgreementErrors = async()=>{
      const formErrors = await validateForm();
      const {terms:termsError} = formErrors||{};
      return termsError;
    }

          return (
            <Form style={{ marginBottom: '60px' }}>
              <>
                <ProductHero
                  isFetchingProduct={isFetchingProduct}
                  currentProduct={heroCurrentProduct}
                  setProductPrice={setProductPrice}
                  setWhereBooking={setWhereBooking}
                  lineItems={lineItems}
                  setLineItems={setlineItems}
                  values={values}
                  treatmentChoices={treatments}
                />
              </>
              <FieldArray name="userData">
                {() =>
                  values.userData.map((item, index) => {
                    return (
                      <div key={index}>
                        {/* button to remove added item */}
                        {
                          values.userData.length > 1 && index !== 0 && (
                            <div className="remove-wrapper">
                              <p className="person-to-remove">Person {index + 1}</p>
                              <button
                                className='remove-person-button'
                                type="button"
                                onClick={() => removeFromList(index, values, setValues)}
                              >
                                Delete person {index + 1}
                              </button>
                            </div>
                          )
                        }

                        <div className="user-detail-main" id='user-detail-section'>
                          <p className='form-main-titles'>Fill out your details</p>
                          <UserDetail index={index} />
                        </div>
                        {index === 0 && <div className="booking-location-main" id="booking-location-main">
                          <p className='form-main-titles'>Choose Location</p>
                          <BookingLocation
                            index={index}
                            values={values}
                            setWhereBooking={setWhereBooking}
                            userDataErrors={userDataErrors}
                            setRefactoredErrors={setRefactoredErrors}
                          />
                        </div>}
                        <div className='choose-treatments-main' id="choose-treatments-main">
                          <p className="form-main-titles">Choose Treatments</p>
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectIvTherapies}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectIvTherapies?.[0]?.categories[0]?.name}
                            ivTherapy
                            currentProduct={currentProduct}
                            setCurrentProduct={setCurrentProduct}
                            whereBooking={whereBooking}
                            isFetchingProduct={isFetchingProduct}
                          />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectNad}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectNad?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectAdons}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectAdons?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectBooster}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectBooster?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectVitaminInjections}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectVitaminInjections?.[0]?.categories[0]?.name} />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectAdvancedTherapies}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectAdvancedTherapies?.[0]?.categories[0]?.name} />
                        </div>
                        <>

                        </>
                      </div>
                    )
                  })
                }
              </FieldArray>
              <div className='add-another-person-main'>
                {areThereUserDataErrors &&
                  <div className="another-person-info-error">
                    <img src="http://rejuve.md/wp-content/uploads/2024/05/info-1.svg" />
                    <p
                      className='fill-all-fields'>
                      Please fill your information before adding another person
                    </p>
                  </div>
                }
                <button type="button"
                  className={areThereUserDataErrors ? 'add-another-person-button btn-disabled' : 'add-another-person-button'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
                  onClick={() => {
                    handleAddUserValidation().then((userErrorExists) => {
                      if (!userErrorExists) {
                        setHasUserDataErrors(false);
                        updateForm(values, setValues);
                      }
                    });
                  }}>
                  <img src="http://rejuve.md/wp-content/uploads/2024/05/personIcon-1.svg" />
                  Add Another Person</button>
              </div>
              {/* Choose Providers */}
              <div className="choose-providers" id="choose-providers">
                <p className="form-main-titles">Choose Provider</p>
                <Providers
                  providers={providers}
                  handleProviderChange={handleProviderChange}
                  selectedProvider={selectedProvider}
                  values={values}
                />
              </div>
              {/* booking date and time preference */}
              <div className="choose-providers" id="choose-providers">
                <p className="form-main-titles">Booking Date and Time Preference</p>
                <BookingDateTime />
              </div>
              {/* almost done */}
              <div className="choose-providers" id="choose-providers">
                <p className="form-main-titles">Almost Done</p>
                <AlmostDoneSection
                  calculatedTipAmount={calculatedTipAmount}
                  handleCustomTipChange={handleCustomTipChange}
                  handlePercentageChange={handlePercentageChange}
                  defaultTip={defaultTip}
                  values={values}
                  setValues={setValues}
                />
              </div>
              {/* order summary */}
              <div className="order-summary-main" id="order-summary-main">
                <p className="form-main-titles">Order Summary</p>
                <div className="order-summary-main-inner" id="order-summary-main-in">
                  {
                    values?.userData?.length > 0 && values?.userData.map((item, userIndex) => {
                      return (
                        <div key={userIndex} className='personWrapper'>
                          <p className="form-main-inner-title">{
                            userIndex === 0 ? item?.billing?.first_name + ' ' + item?.billing?.last_name :
                              'Person' + userIndex + 1}({values?.bookingChoice === 'atourclinics' ? 'house call' : 'clinic'})</p>
                          <div className="item-price-summary-wrapper">
                            {
                              lineItems.length > 0 && lineItems.map((lineItem, index) => {
                                return (
                                  lineItem?.userIndex === userIndex &&
                                  <div key={index} className="item-price-summary">
                                    <p className='product-name-summary'>{
                                      lineItem?.userIndex === userIndex &&
                                      lineItem?.productName}</p>
                                    <p className='product-price-summary'>${lineItem?.price}</p>
                                  </div>
                                )

                              }
                              ) ||
                              <div className="item-price-summary">
                                <p className='product-name-summary'>No item selected</p>
                                <p className='product-price-summary'>$0.00</p>
                              </div>
                            }
                          </div>
                        </div>
                      )
                    })
                  }

                  <div className="total-summary-whole-wrapper">
                    <div className="sub-total-summary">
                      <div className="total-label-price">
                        <p className="sub-total-summary-label">
                          Subtotal
                        </p>
                        <p className="sub-total-summary-price">
                          ${totalCalculation.toFixed(2)}
                        </p>
                      </div>
                      <div className="total-label-price">
                        <p className="sub-total-summary-label">
                          Tip({tips?.customTip ? `${Number(tips?.customTip)} $` : `${Number(tips?.percentageTip)}%`})
                        </p>
                        <p className="sub-total-summary-price">
                          ${Number(calculatedTipAmount).toFixed(2)}
                        </p>
                      </div>
                      <div className="total-label-price total-calculation">
                        <p className="total-calculation-label">Total</p>
                        <p className="total-calculation-price">${
                          (totalCalculation + Number(calculatedTipAmount)).toFixed(2)
                        }</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='choose-providers' id="credit-card-section">
                <p className="form-main-titles">Choose your desired payment method:</p>
                <div className="payment-cards-wrapper">
                  <CustomInput
                    label="Card Number"
                    name="paymentMethod"
                    type="radio"
                    value="creditCard"
                  />
                  <CustomInput
                    label="Pay at Location"
                    name="paymentMethod"
                    type="radio"
                    value="payAtLocation"
                  />
                </div>
                <CardPaymentMethod
                  values={values}
                />
              </div>
              {/* Payment Method */}
              <div className='agreement-wrapper-main' id="credit-card-section">
                <Agreement
                  agreeToTos={agreeToTos}
                  setAgreeToTos={setAgreeToTos}
                  agreeToCreateAccount={agreeToCreateAccount}
                  setAgreeToCreateAccount={setAgreeToCreateAccount}
                  agreeToSignUp={agreeToSignUp}
                  setAgreeToSignUp={setAgreeToSignUp}
                />
              </div>
              {/* submit button */}
              <div className="book-and-pay-btn-wrapper">
              <button type="submit"
  // className={hasAnyErrors ? 'book-and-pay-btn-disabled' : 'book-and-pay-btn'}
  // className={'book-and-pay-btn'}
  className={hasAnyErrors ? 'book-and-pay-btn disabled' : 'book-and-pay-btn'}
  // disabled={hasAnyErrors}
  onClick={(e) => {
    e.preventDefault();
    // hasAnyErrors &&
    checkAgreementErrors().then((termsError) => {
      if (termsError) {
        setTermsError(true);
        return;
      }
      setTermsError(false);
    });
    checkForAnyErrors().then((hasErrors) => {
      if (hasErrors) {
        setHasAnyErrors(true);
        return;
      }
      setHasAnyErrors(false);
      submitForm(values);
    });


    submitForm(values);
  }}
>
                  <div><img src="http://rejuve.md/wp-content/uploads/2024/05/lock-icon-1.svg" alt="" /></div>
                  <p style={{ margin: 0 }}>  Book and Pay</p>
                </button>
                 
              </div>
              {/* {Object.keys(errors).length > 0 && <small style={{ color: 'red', fontSize: '16px' }}>Please fill all fields</small>} */}
              {termsError && <div className='click-agree-reminder-wrapper'>
                <img src="/src/assets/info.svg" />
                <p className="agree-to-tos-info">
                  You need to read and agree to our Tos, Privacy Policy , Consent To Treat and Cancellation Policy to continue booking.</p></div>}
                  {hasUserDataErrors && <div className='click-agree-reminder-wrapper'>
                <img src="/src/assets/info.svg" />
                <p className="agree-to-tos-info">
                Fill all required fields to continue booking. 
                 </p></div>}
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default FormSection