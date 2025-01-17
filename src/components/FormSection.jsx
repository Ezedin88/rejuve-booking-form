import '../mainStyles.css';
import propTypes from 'prop-types';
import { FieldArray, Form, Formik, setNestedObjectValues } from 'formik';
import { handleValidation } from '../Validation';
import { initialValues } from '../initialValues';
import UserDetail from './UserDetail';
import Providers from './Providers';
import BookingDateTime from './BookingDateTime';
import AlmostDoneSection from './AlmostDone';
import CardPaymentMethod from './CardPaymentMethod';
import Agreement from './Agreement';
import { useEffect, useState } from 'react';
import ChooseTreatments from './ChooseTreatments';
import BookingLocation from './BookingLocation';
import ProductHero from './ProductHero';
import CustomInput from '../CustomInput';
import WhyRejuve from './WhyRejuve';
import OrderSummary from './OrderSummary';
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
  removeFromList,
  submitForm,
  handleSubmit,
  isFetchingProduct,
  setCurrentProduct,
  setWhereBooking,
  whereBooking,
  heroCurrentProduct,
  tipOptions,
  tips,
  // payment related
  messagePayment,
  isProcessingPayment,
  setTheCardNumberElement,
  setTheClientSecret,
  setTotalWithTip,
  isScriptLoaded,
  dataPage,
}) {
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  const selectAdons = treatments
    ?.filter((item) =>
      item.product_slug.includes('ad-ons')
    )
    ?.sort((a, b) => a.name.localeCompare(b.name)); // Use localeCompare for string comparison

  const selectBooster = treatments
    ?.filter((item) =>
      item.product_slug.includes('booster')
    )
    ?.sort((a, b) => a.name.localeCompare(b.name));

  const selectPeptides = treatments
    ?.filter((item) =>
      item.product_slug.includes('peptides')
    )
    ?.sort((a, b) => a.name.localeCompare(b.name));
  // const selectVitaminInjections = treatments.filter((item) =>
  //   item.categories.some((category) => category.slug === 'vitamin-injections')
  // );
  // const selectAdvancedTherapies = treatments.filter((item) =>
  //   item.categories.some((category) => category.slug === 'advanced-therapies')
  // );
  const selectIvTherapies = treatments
    ?.filter((item) => item.product_slug?.includes('iv-treatment'))
    ?.sort((a, b) => a.name.localeCompare(b.name)); // Adjusted for descending order
  // const selectDecolettage = treatments.filter((item) =>
  //   item.categories[0]?.name === 'Botox Products'
  // );

  const totalCalculation = lineItems.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );

  const [availableBookingPeriods, setAvailableBookingPeriods] = useState([]);

  useEffect(() => {
    setTotalWithTip(totalCalculation + Number(calculatedTipAmount || 0));
  }, [totalCalculation, calculatedTipAmount]);

  const [hasAnyErrors, setHasAnyErrors] = useState(false);
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
        {({ values, errors, setValues, setTouched, validateForm }) => {
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

          return (
            <Form style={{ marginBottom: '60px', width: '100%' }}>
              <>
                <ProductHero
                  isFetchingProduct={isFetchingProduct}
                  currentProduct={heroCurrentProduct}
                  setCurrentProduct={setCurrentProduct}
                  setWhereBooking={setWhereBooking}
                  lineItems={lineItems}
                  setLineItems={setlineItems}
                  values={values}
                  treatmentChoices={treatments}
                  selectNad={selectNad}
                  dataPage={dataPage}
                  peptides
/>
                {/* <div className="user-detail-main" id='user-detail-section'> */}
                <WhyRejuve currentProduct={heroCurrentProduct} />
                {/* </div> */}
              </>
              <section className="product-page-form-section-wrapper" id="user-detail-section">
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
                          <div className="general-details-card-wrapper">
                            <p className="form-main-titles">
                              Fill out your details
                            </p>
                            <div
                              className="user-detail-main"
                            >
                              <UserDetail index={index} />
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="general-details-card-wrapper">
                              <p className="form-main-titles">
                                Choose Location
                              </p>
                              <div
                                className="booking-location-main"
                                id="booking-location-main"
                              >
                                <BookingLocation
                                  index={index}
                                  values={values}
                                  setWhereBooking={setWhereBooking}
                                  isScriptLoaded={isScriptLoaded}
                                  currentProduct={heroCurrentProduct}
                                  lineItems = {lineItems}
                                  setLineItems = {setlineItems}
                                  nadChoices={selectNad}
                                />
                              </div>
                            </div>
                          )}
                          <div className="general-details-card-wrapper">
                            <div
                              className="choose-treatments-main"
                              id="choose-treatments-main"
                            >
                              <p className="form-main-titles">
                                Choose Treatments
                              </p>
                              <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectIvTherapies}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                ivTherapy
                                // isDecolettage={isDecolettage}
                                setCurrentProduct={setCurrentProduct}
                                whereBooking={whereBooking}
                                isFetchingProduct={isFetchingProduct}
                              />
                              {/* {isDecolettage && (
                                <ChooseTreatments
                                  dataValues={values}
                                  treatmentChoices={selectDecolettage}
                                  index={index}
                                  lineItems={lineItems}
                                  setlineItems={setlineItems}
                                  title={
                                    selectDecolettage?.[0]?.categories[0]?.name
                                  }
                                />
                              )} */}
                              <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectNad}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={selectNad?.[0]?.categories[0]?.name}
                                setCurrentProduct={setCurrentProduct}
                                currentProduct={heroCurrentProduct}
                                nadItem
                              />
                              <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectAdons}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={selectAdons?.[0]?.categories[0]?.name}
                                currentProduct={heroCurrentProduct}
                                setCurrentProduct={setCurrentProduct}
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
                                treatmentChoices={selectPeptides}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={selectPeptides?.[0]?.categories[0]?.name}
                              />
                              {/* <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectVitaminInjections}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={
                                  selectVitaminInjections?.[0]?.categories[0]
                                    ?.name
                                }
                              /> */}
                              {/* <ChooseTreatments
                                dataValues={values}
                                treatmentChoices={selectAdvancedTherapies}
                                index={index}
                                lineItems={lineItems}
                                setlineItems={setlineItems}
                                title={
                                  selectAdvancedTherapies?.[0]?.categories[0]
                                    ?.name
                                }
                              /> */}
                            </div>
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
                      <img src="http://rejuve.com/wp-content/uploads/2024/05/info-1.svg" />
                      <p className="fill-all-fields">
                        Please fill your information before adding another
                        person
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
                    <img src="http://rejuve.com/wp-content/uploads/2024/05/personIcon-1.svg" />
                    Add Another Person
                  </button>
                </div>
                {/* Choose Providers */}
                <div className="general-details-card-wrapper">
                  <p className="form-main-titles">Choose Provider</p>
                  <div className="choose_providers_wrapper">
                    <div className="choose-providers" id="choose-providers">
                      <Providers
                        providers={providers}
                        handleProviderChange={handleProviderChange}
                        selectedProvider={selectedProvider}
                        values={values}
                        setAvailableBookingPeriods={setAvailableBookingPeriods}
                      />
                    </div>
                  </div>
                </div>
                {/* booking date and time preference */}
                <div className="general-details-card-wrapper">
                  <p className="form-main-titles">
                    Booking Date and Time Preference
                  </p>
                  <div className="choose_providers_wrapper book_time_wrapper">
                    <div className="choose-providers" id="choose-providers">
                      <BookingDateTime
                        values={values}
                        providers={providers}
                        availableBookingPeriods={availableBookingPeriods}
                      />
                    </div>
                  </div>
                </div>
                {/* almost done */}
                <div className="general-details-card-wrapper">
                  <p className="form-main-titles">Almost Done</p>
                  <div className="choose_providers_wrapper almost_done">
                    <div
                      className="almost-done-section"
                      id="almost-done-section"
                    >
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
                </div>
                {/* order summary */}
                <OrderSummary
                  lineItems={lineItems}
                  totalCalculation={totalCalculation}
                  calculatedTipAmount={calculatedTipAmount}
                  tips={tips}
                  values={values}
                />
                {/* Payment Method */}
                <div className="general-details-card-wrapper">
                  <p className="form-main-titles">
                    Choose your desired payment method:
                  </p>
                  <div className="choose_providers_wrapper">
                    <div className="choose-providers" id="credit-card-section">
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
                        messagePayment={messagePayment}
                        isProcessingPayment={isProcessingPayment}
                        setTheCardNumberElement={setTheCardNumberElement}
                        setTheClientSecret={setTheClientSecret}
                        isScriptLoaded={isScriptLoaded}
                      />
                    </div>
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
                <div className="book-and-pay-btn-wrapper">
                  <button
                    style={{ marginBottom: '15px' }}
                    type="submit"
                    className={
                      hasAnyErrors || termsError
                        ? 'book-and-pay-btn disabled'
                        : 'book-and-pay-btn'
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      const termsError = await checkAgreementErrors();
                      if (termsError) {
                        return;
                      }

                      const hasErrors = await checkForAnyErrors();
                      if (hasErrors) {
                        return; 
                      }

                      // If no errors, submit the form
                      submitForm(values);
                    }}
                    disabled={isProcessingPayment && true}
                  >
                    <div>
                      <img
                        src="http://rejuve.com/wp-content/uploads/2024/05/lock-icon-1.svg"
                        alt="locked icon"
                      />
                    </div>
                    <p style={{ margin: 0 }}>
                      {isProcessingPayment
                        ? 'Processing Payment...'
                        : 'Book and Pay'}
                    </p>
                  </button>
                </div>
              </section>
              {/* {Object.keys(errors).length > 0 && <small style={{ color: 'red', fontSize: '16px' }}>Please fill all fields</small>} */}
              {termsError && (
                <div className="click-agree-reminder-wrapper">
                  <img src="http://rejuve.com/wp-content/uploads/2024/05/info-1.svg" />
                  <p className="agree-to-tos-info">
                    You need to read and agree to our{' '}
                    <a
                      href="https://rejuve.com/tos-policy/"
                      target="_blank"
                      alt="Terms of Service"
                    >
                      Tos
                    </a>
                    ,
                    <a
                      href="https://rejuve.com/privacy-policy/"
                      target="_blank"
                      alt="Privacy policy"
                    >
                      Privacy Policy
                    </a>
                    ,
                    <a
                      href="https://rejuve.com/consent-to-treat-policy/"
                      target="_blank"
                      alt="Consent to Treat"
                    >
                      {' '}
                      Consent To Treat
                    </a>{' '}
                    and
                    <a
                      href="https://rejuve.com/cancellation-policy/"
                      target="_blank"
                      alt="Cancellation Policy"
                    >
                      {' '}
                      Cancellation Policy
                    </a>{' '}
                    to continue booking.
                  </p>

                </div>
              )}
              {hasUserDataErrors && (
                <div className="click-agree-reminder-wrapper">
                  <img src="http://rejuve.com/wp-content/uploads/2024/05/info-1.svg" />
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

FormSection.propTypes = {
  lineItems: propTypes.array,
  setlineItems: propTypes.func,
  treatments: propTypes.array,
  providers: propTypes.array,
  selectedProvider: propTypes.string,
  handleProviderChange: propTypes.func,
  handleCustomTipChange: propTypes.func,
  handlePercentageChange: propTypes.func,
  defaultTip: propTypes.number,
  calculatedTipAmount: propTypes.number,
  selectNad: propTypes.array,
  updateForm: propTypes.func,
  fieldsAreEmpty: propTypes.bool,
  fieldsAreEmptyForUpdate: propTypes.bool,
  removeFromList: propTypes.func,
  submitForm: propTypes.func,
  handleSubmit: propTypes.func,
  isFetchingProduct: propTypes.bool,
  currentProduct: propTypes.object,
  setCurrentProduct: propTypes.func,
  setWhereBooking: propTypes.func,
  whereBooking: propTypes.string,
  currentMainProduct: propTypes.object,
  heroCurrentProduct: propTypes.object,
  tipOptions: propTypes.object,
  tips: propTypes.object,
  messagePayment: propTypes.string,
  isProcessingPayment: propTypes.bool,
  setTheCardNumberElement: propTypes.func,
  setTheClientSecret: propTypes.func,
  setTotalWithTip: propTypes.func,
  isScriptLoaded: propTypes.bool,
  dataPage: propTypes.bool,
};