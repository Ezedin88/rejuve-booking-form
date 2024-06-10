import '../mainStyles.css';
import {
  FieldArray,
  Form,
  Formik,
  setNestedObjectValues,
} from 'formik';
import { handleValidation } from '../Validation';
import { initialValues } from '../initialValues';
import UserDetail from './UserDetail';
import Providers from './Providers';
import BookingDateTime from './BookingDateTime';
import AlmostDoneSection from './AlmostDone';
import CardPaymentMethod from './CardPaymentMethod';
import Agreement from './Agreement';
import { useEffect, useRef, useState } from 'react';
import ChooseTreatments from './ChooseTreatments';
import BookingLocation from './BookingLocation';
import ProductHero from './ProductHero';
import CustomInput from '../CustomInput';
import WhyRejuve from './WhyRejuve';
import OrderSummary from './OrderSummary';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
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
  tipOptions,
  tips,
  // payment related
  messagePayment,
  isProcessingPayment,
  setTheCardNumberElement,
  setTheClientSecret,
  setTotalWithTip,
}) {
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  const selectAdons = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'ad-ons')
  );
  const selectBooster = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'booster')
  );
  const selectVitaminInjections = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'vitamin-injections')
  );
  const selectAdvancedTherapies = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'advanced-therapies')
  );
  const selectIvTherapies = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'iv-treatment')
  );
  const selectDecolettage = treatments.filter((item) =>
    item.categories[0]?.name==='Botox Products'
  );
  const currentProductPrice = Number(currentProduct?.price) || 0;
  const totalCalculation = lineItems.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );
  const [recaptchaErrorMessage, setRecaptchaErrorMessage] = useState('');
  const [availableBookingPeriods, setAvailableBookingPeriods] = useState([]);

  useEffect(() => {
    setTotalWithTip(totalCalculation + Number(calculatedTipAmount || 0));
  }, [totalCalculation, calculatedTipAmount]);
  const rejuvehangoverId = '6LddwPIpAAAAAJW6Zt3K8FGZ5jD0ZsTdSYq_HP2l';

  const [refactoredErrors, setRefactoredErrors] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const [hasAnyErrors, setHasAnyErrors] = useState(false);
  const [hasUserDataErrors, setHasUserDataErrors] = useState(false);
  const recaptchaRef = useRef(null);

  return (
    <>
      <Formik
        validationSchema={handleValidation}
        initialValues={initialValues}
        validateOnChange
        validateOnBlur
        onSubmit={handleSubmit}
      >
        {({ values, errors, setValues, setTouched, validateForm,setFieldValue, isValid }) => {
          // from localstorage get booking-location-choice item it's a string
          const bookingLocationChoice = localStorage.getItem('booking-location-choice');
          if(bookingLocationChoice){
            // values.bookingChoice = bookingLocationChoice;
            setFieldValue('bookingChoice', bookingLocationChoice);
          }
          
      const hasErrors =
            Object.keys(errors).filter((key) => key !== 'terms').length > 0;
          if (!hasErrors) {
            setHasAnyErrors(false);
          }
          
          const { terms: termsError, userData: userDataErrors } = errors || {};
          const areThereUserDataErrors =
            userDataErrors && userDataErrors.length > 0;

          const checkForAnyErrors = async () => {
            setTouched(setNestedObjectValues(values, true));
            const formErrors = await validateForm();
            const filteredFormErrors = Object.keys(formErrors)
              .filter((key) => key !== 'terms')
              .reduce((obj, key) => {
                obj[key] = formErrors[key];
                return obj;
              }, {});
            const hasErrors =
              filteredFormErrors && Object.keys(filteredFormErrors).length > 0;
            setHasUserDataErrors(hasErrors);
            return hasErrors;
          };

          const handleAddUserValidation = async () => {
            const formErrors = await validateForm();
            const {
              userData: userDataErrors,
              bookingAddressErrors,
              clinicChoiceErrors,
            } = formErrors || {};
            const userErrorExists =
              (userDataErrors && Object.keys(userDataErrors).length > 0) ||
              (bookingAddressErrors &&
                Object.keys(bookingAddressErrors).length > 0) ||
              clinicChoiceErrors;
            setHasUserDataErrors(userErrorExists);
            return userErrorExists;
          };

          const checkAgreementErrors = async () => {
            const formErrors = await validateForm();
            const { terms: termsError } = formErrors || {};
            return termsError;
          };
          
          const isDecolettage = currentProduct?.slug === 'decolletage';
          return (
            <Form style={{ marginBottom: '60px' }}>
              <>
                <ProductHero
                  isFetchingProduct={isFetchingProduct}
                  currentProduct={heroCurrentProduct}
                  setCurrentProduct={setCurrentProduct}
                  setProductPrice={setProductPrice}
                  setWhereBooking={setWhereBooking}
                  lineItems={lineItems}
                  setLineItems={setlineItems}
                  values={values}
                  treatmentChoices={treatments}
                  selectNad={selectNad}
                />
                {/* <div className="user-detail-main" id='user-detail-section'> */}
                <WhyRejuve currentProduct={heroCurrentProduct} />
                {/* </div> */}
              </>
              <FieldArray name="userData">
                {() =>
                  values.userData.map((item, index) => {
                    return (
                      <div key={index} className="user_wrapper">
                        {/* button to remove added item */}
                        {values.userData.length > 1 && index !== 0 && (
                          <div className="remove-wrapper">
                            <p className="person-to-remove">
                              Person {index + 1}
                            </p>
                            <button
                              className="remove-person-button"
                              type="button"
                              onClick={() =>
                                removeFromList(index, values, setValues)
                              }
                            >
                              Delete person {index + 1}
                            </button>
                          </div>
                        )}

                        <div
                          className="user-detail-main"
                          id="user-detail-section"
                        >
                          <p className="form-main-titles">
                            Fill out your details
                          </p>
                          <UserDetail index={index} />
                        </div>
                        {index === 0 && (
                          <div
                            className="booking-location-main"
                            id="booking-location-main"
                          >
                            <p className="form-main-titles">Choose Location</p>
                            <BookingLocation
                              index={index}
                              values={values}
                              setWhereBooking={setWhereBooking}
                              userDataErrors={userDataErrors}
                              setRefactoredErrors={setRefactoredErrors}
                            />
                          </div>
                        )}
                        <div
                          className="choose-treatments-main"
                          id="choose-treatments-main"
                        >
                          <p className="form-main-titles">Choose Treatments</p>
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectIvTherapies}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectIvTherapies?.[0]?.categories[0]?.name}
                            ivTherapy
                            isDecolettage={isDecolettage}
                            setCurrentProduct={setCurrentProduct}
                            whereBooking={whereBooking}
                            isFetchingProduct={isFetchingProduct}
                          />
                          {
                            isDecolettage &&  (
                              <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectDecolettage}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={selectDecolettage?.[0]?.categories[0]?.name}
                              />
                            )
                          }
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectNad}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectNad?.[0]?.categories[0]?.name}
                          />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectAdons}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectAdons?.[0]?.categories[0]?.name}
                          />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectBooster}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={selectBooster?.[0]?.categories[0]?.name}
                          />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectVitaminInjections}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={
                              selectVitaminInjections?.[0]?.categories[0]?.name
                            }
                          />
                          <ChooseTreatments
                            dataValues={values}
                            treatmentChoices={selectAdvancedTherapies}
                            index={index}
                            lineItems={lineItems}
                            setlineItems={setlineItems}
                            title={
                              selectAdvancedTherapies?.[0]?.categories[0]?.name
                            }
                          />
                        </div>
                        <></>
                      </div>
                    );
                  })
                }
              </FieldArray>
              <div className="add-another-person-main">
                {areThereUserDataErrors && (
                  <div className="another-person-info-error">
                    <img src="http://rejuve.md/wp-content/uploads/2024/05/info-1.svg" />
                    <p className="fill-all-fields">
                      Please fill your information before adding another person
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className={
                    areThereUserDataErrors
                      ? 'add-another-person-button btn-disabled'
                      : 'add-another-person-button'
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                  }}
                  onClick={() => {
                    handleAddUserValidation().then((userErrorExists) => {
                      if (!userErrorExists) {
                        setHasUserDataErrors(false);
                        updateForm(values, setValues);
                      }
                    });
                  }}
                >
                  <img src="http://rejuve.md/wp-content/uploads/2024/05/personIcon-1.svg" />
                  Add Another Person
                </button>
              </div>
              {/* Choose Providers */}
              <div className="choose_providers_wrapper">
                <div className="choose-providers" id="choose-providers">
                  <p className="form-main-titles">Choose Provider</p>
                  <Providers
                    providers={providers}
                    handleProviderChange={handleProviderChange}
                    selectedProvider={selectedProvider}
                    values={values}
                    setAvailableBookingPeriods={setAvailableBookingPeriods}
                  />
                </div>
              </div>
              {/* booking date and time preference */}
              <div className="choose_providers_wrapp">
                <div className="choose-providers" id="choose-providers">
                  <p className="form-main-titles">
                    Booking Date and Time Preference
                  </p>
                  <BookingDateTime values={values} providers={providers} 
                    availableBookingPeriods={availableBookingPeriods} 
                  />
                </div>
              </div>
              {/* almost done */}
              <div className="choose_providers_wrapper">
                <div className="choose-providers" id="choose-providers">
                  <p className="form-main-titles">Almost Done</p>
                  <AlmostDoneSection
                    calculatedTipAmount={calculatedTipAmount}
                    handleCustomTipChange={handleCustomTipChange}
                    handlePercentageChange={handlePercentageChange}
                    defaultTip={defaultTip}
                    values={values}
                    setValues={setValues}
                    tipOptions={tipOptions}
                  />
                </div>
              </div>
              {/* order summary */}
              <OrderSummary lineItems={lineItems} totalCalculation={totalCalculation} calculatedTipAmount={calculatedTipAmount} tips={tips} values={values}/>
              {/* Payment Method */}
              <div className="choose_providers_wrapper">
                <div className="choose-providers" id="credit-card-section">
                  <p className="form-main-titles">
                    Choose your desired payment method:
                  </p>
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
                  <CardPaymentMethod values={values} 
                      messagePayment={messagePayment}
                      isProcessingPayment={isProcessingPayment}
                      setTheCardNumberElement={setTheCardNumberElement}
                      setTheClientSecret={setTheClientSecret}
                  />
                </div>
              </div>
              {/* Choose Providers */}
              <div className="choose_providers_wrapper">
                <div
                  className="agreement-wrapper-main"
                  id="credit-card-section"
                >
                  <Agreement
                    agreeToTos={agreeToTos}
                    setAgreeToTos={setAgreeToTos}
                    agreeToCreateAccount={agreeToCreateAccount}
                    setAgreeToCreateAccount={setAgreeToCreateAccount}
                    agreeToSignUp={agreeToSignUp}
                    setAgreeToSignUp={setAgreeToSignUp}
                  />
                </div>
              </div>
              {/* submit button */}
              <div className="choose_providers_wrapper">
                <div className="book-and-pay-btn-wrapper">
                  <button
                  style={{marginBottom:'15px'}}
                    type="submit"
                    className={
                      hasAnyErrors || termsError
                        ? 'book-and-pay-btn disabled'
                        : 'book-and-pay-btn'
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                        const recaptchaToken = recaptchaRef.current ? recaptchaRef.current.getValue() : null;
                        if (!recaptchaToken) {
                          toast('Please verify the reCAPTCHA!',{type:'error'})
                          return;
                        }
                      const termsError = await checkAgreementErrors();
                      if (termsError) {
                        setTermsError(true);
                        return; // Stop execution if there's a terms error
                      } else {
                        setTermsError(false);
                      }

                      const hasErrors = await checkForAnyErrors();
                      if (hasErrors) {
                        setHasAnyErrors(true);
                        return; // Stop execution if there are any other errors
                      } else {
                        setHasAnyErrors(false);
                        setTermsError(false);
                      }

                      // If no errors, submit the form
                      submitForm(values);
                    }}
                    disabled={isProcessingPayment && true}
                  >
                    <div>
                      <img
                        src="http://rejuve.md/wp-content/uploads/2024/05/lock-icon-1.svg"
                        alt="locked icon"
                      />
                    </div>
                    <p style={{ margin: 0 }}>{
                    isProcessingPayment ? 'Processing Payment...' : 'Book and Pay'
                    }</p>
                  </button>
                  <ReCAPTCHA sitekey={rejuvehangoverId} ref={recaptchaRef} style={{maxWidth:'320px !important'}}/>
                </div>
              </div>
              {/* {Object.keys(errors).length > 0 && <small style={{ color: 'red', fontSize: '16px' }}>Please fill all fields</small>} */}
              {termsError && (
                <div className="click-agree-reminder-wrapper">
                  <img src="http://rejuve.md/wp-content/uploads/2024/05/info-1.svg" />
                  <p className="agree-to-tos-info">
                    You need to read and agree to our Tos,
                    <a
                      href="https://rejuve.md/privacy-policy/"
                      alt="Privacy policy"
                    >
                      Privacy Policy
                    </a>
                    , Consent To Treat and Cancellation Policy to continue
                    booking.
                  </p>
                </div>
              )}
              {hasUserDataErrors && (
                <div className="click-agree-reminder-wrapper">
                  <img src="http://rejuve.md/wp-content/uploads/2024/05/info-1.svg" />
                  <p className="agree-to-tos-info">
                    Fill all required fields to continue booking.
                  </p>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default FormSection;
