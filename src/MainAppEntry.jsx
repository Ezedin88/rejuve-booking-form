import './App.css';
import { useEffect, useState } from 'react';
import { client } from './api/client';
import FormSection from './components/FormSection';
import { useFormik } from 'formik';
import { initialValues } from './initialValues';
import { getProductPrice } from './utils/getProductPrice';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { organizeLineItems } from './utils/organizeLineitems';
import { Slide, ToastContainer, toast } from 'react-toastify';
import {Loader} from "@googlemaps/js-api-loader";
import 'react-toastify/dist/ReactToastify.css';

function MainAppEntry() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState('others');
  const [defaultTip, setDefaultTip] = useState(0);
  const [percentageTip, setPercentageTip] = useState(0);
  const [customTip, setCustomTip] = useState(0);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [whereBooking, setWhereBooking] = useState('atourclinics');
  const [providers, setProviders] = useState([]);
  const [stripePromise, setStripePromise] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalWithTip, setTotalWithTip] = useState(0);

  
  useEffect(()=>{
    const loader = new Loader({
      apiKey: 'AIzaSyBiMgA18QMFdnj67qadAYRk816SdI8c8ag',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      setIsScriptLoaded(true);
    });
  },[])

  const dataPage = document
    .querySelector('[data-page_id]')?.getAttribute('data-page_id');

  const isFormFilled = (values) => {
    // Check if any of the fields in the current form are empty
    return values.userData.every((item) =>
      Object.values(item.billing).every((field) => field !== '')
    );
  };


 const checkMenuTreatments = JSON.parse(localStorage.getItem('selectedTreatments'));
  const [lineItems, setlineItems] = useState(checkMenuTreatments||[]);
  const [fieldsAreEmptyForUpdate, setFieldsAreEmptyForUpdate] = useState(false);
  const [fieldsAreEmpty, setFieldsAreEmpty] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('Any');
  const [currentProduct, setCurrentProduct] = useState({});
  const [currentProductCopy, setCurrentProductCopy] = useState({});
  const selectNad = treatments.filter((item) =>
    item.categories.some((category) => category.slug === 'nad')
  );

  // const providerId = providers.find(provider => provider.name === selectedProvider)?.id;

  useEffect(() => {
    if (fieldsAreEmpty) {
      setTimeout(() => {
        setFieldsAreEmpty(false);
      }, 5000);
    }

    if (fieldsAreEmptyForUpdate) {
      setTimeout(() => {
        setFieldsAreEmptyForUpdate(false);
      }, 5000);
    }
  }, [fieldsAreEmpty, fieldsAreEmptyForUpdate]);

  const { values } = useFormik({ initialValues });
  useEffect(() => {
    const { bookHouseCall } =
      getProductPrice({ product: currentProduct, isFetchingProduct }) || {};
    const fetchTreatments = async () => {
      const data = await client.getAllTreatments();
      setTreatments(data);
    };
    const fetchProviders = async () => {
      const data = await client.getAllProviders();
      setProviders(data);
    };

    const fetchProductById = async () => {
      setIsFetchingProduct(true);
      const data = await client.getProductById(dataPage||null)??null;
      if(data){
      setCurrentProduct(data);
      setCurrentProductCopy(data);
      }
      if(data){
      data?.id !== 582 &&
        setlineItems([
          ...lineItems,
          {
            userIndex: 0,
            product_id: data?.id,
            productName: data?.name,
            variation_id:
              values.bookingChoice !== 'atourclinics'
                ? data?.variations?.[1]?.id
                : data?.variations?.[0]?.id,
            price:
              values.bookingChoice === 'housecall' ? bookHouseCall : data?.price,
            quantity: 1,
            metaData: [],
          },
        ])}
      setIsFetchingProduct(false);
    };

    fetchProductById();
    fetchProviders();
    fetchTreatments();
  }, []);

  useEffect(()=>{
    if(treatments && treatments?.length>0){
      const event = new Event('reactAppLoaded');
      window.dispatchEvent(event);
    }
  },[treatments])

  // Remove item from localStorage when navigating away from the about page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.removeItem('selectedTreatments');
      localStorage.removeItem('booking-location-choice');
      localStorage.removeItem('bookingData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

    const fetchPaymentIntent = async (values) => {
      try {
        const response = await fetch(
          'https://rejuve.com/wp-json/stripe/v1/create-payment-intent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              totalWithTip,
              customer_email: values.userData[0].billing.email,
              customer_name:
                values.userData[0].billing.first_name +
                ' ' +
                values.userData[0].billing.last_name,
            }),
          }
        );

        const data = await response.json();
        if (data) {
          // setClientSecret(data.clientSecret);
          return data.clientSecret;
        } else {
          throw new Error(data.message || 'Failed to fetch client secret');
        }
      } catch (error) {
        setErrorMessage('Error fetching payment intent');
      }
    };

 
  const removeFromList = (index, values, setValues) => {
    const userData = [...values.userData];
    userData.splice(index, 1);
    setValues({ ...values, userData });
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  const updateForm = (values, setValues) => {
    // if (!isFormFilled(values)) {
    //   setFieldsAreEmptyForUpdate(true);
    //   return;
    // }
    const userData = [...values.userData];
    userData.push({
      billing: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
      },
      line_items: [],
    });
    setValues({
      ...values,
      userData,
      // , provider: selectedProvider
    });
  };
  const allPriceForTipPercentage = lineItems?.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const calculatedTipAmount =
    Number(customTip) ||
    (Number(allPriceForTipPercentage) * Number(percentageTip)) / 100;

  const changeCreatingOrderStatus = (status) => {
    setIsCreatingOrder(status);
  };
  const submitForm = async (values) => {
    setIsProcessing(true);
    try {
      const transformedData = organizeLineItems({
        values,
        lineItems,
        calculatedTipAmount,
        providers,
      });
  
      const { values: dataValues, meta_data, fee_lines } = transformedData || {};
      const dataToSend = dataValues?.userData?.map((item, key) => ({
        status: 'processing',
        payment_method:
          dataValues.paymentMethod === 'creditCard' ? 'stripe' : 'house',
        payment_method_title:
          dataValues.paymentMethod === 'creditCard' ? 'Card' : 'House',
        set_paid: false,
        meta_data,
        billing: { ...item.billing, ...dataValues.bookingAddress },
        line_items: item.line_items,
        fee_lines,
      }));
  
      if (values.paymentMethod === 'creditCard') {
        const theClientSecret = await fetchPaymentIntent(values);
      
        setIsProcessing(true);
  
        const { stripe, elements, cardElement } = values?.cardNumberElement;
  
        if (!stripe || !elements) {
          return;
        }
  
  
        if (theClientSecret) {
  
          const { error, paymentIntent } = await stripe.confirmCardPayment(theClientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: values.biller_details.name,
                email: values.biller_details.email,
                address: {
                  line1: values.biller_details.address.line1,
                  line2: values.biller_details.address.line2,
                  city: values.biller_details.address.city,
                  state: values.biller_details.address.state,
                  postal_code: values.biller_details.address.postal_code,
                }
              },
            },
          });
  
          if (error) {
            console.error('Error during payment confirmation:', error);
            setErrorMessage(error?.message || 'Payment failed');
            toast(error?.message || 'Payment failed', { type: 'error' });
            setIsProcessing(false);
            return;
          }
    
          if (paymentIntent) {
            const areTheSame = values.biller_details.name === values.userData[0].billing.first_name + ' ' + values.userData[0].billing.last_name;
            if (!areTheSame) {
              client.sendEmail({
                message: `The name on the card does not match the billing information provided. Patient Name: ${values.userData[0].billing.first_name} ${values.userData[0].billing.last_name}. Cardholder Name: ${values.biller_details.name}.`,
              })
            }
            setIsProcessing(false);
            if (dataToSend) {
              changeCreatingOrderStatus(true);
              try {
                window.removeEventListener('beforeunload', () => {});
                localStorage.removeItem('selectedTreatments');
                localStorage.removeItem('booking-location-choice');
                localStorage.removeItem('bookingData');
                window.scrollTo(0, 0);
                await client.createOrder(dataToSend);
                if(values.specialInstructions){
                  client.sendEmail({
                    message: `Special Instructions: ${values.specialInstructions}`,
                    customer_email: values.userData[0].billing.email,
                    customer_name: values.userData[0].billing.first_name + ' ' + values.userData[0].billing.last_name,
                  });
                }
                changeCreatingOrderStatus(false);
                window.location.href = 'https://rejuve.com/order-confirmation/';
              } catch (error) {
                changeCreatingOrderStatus(false);
                console.error('Error creating order:', error);
              }
            }
          } else {
            changeCreatingOrderStatus(false);
            setErrorMessage('Payment failed');
            toast('Payment failed', { type: 'error' });
          }
        } else {
          setErrorMessage('Client Secret is not valid');
          setIsProcessing(false);
        }
      } else {
        if (dataToSend) {
          changeCreatingOrderStatus(true);
          try {
            window.removeEventListener('beforeunload', () => {});
            localStorage.removeItem('selectedTreatments');
            localStorage.removeItem('booking-location-choice');
            localStorage.removeItem('bookingData');
            window.scrollTo(0, 0);
            changeCreatingOrderStatus(true);
            await client.createOrder(dataToSend);
            if(values.specialInstructions){
              client.sendEmail({
                message: `Special Instructions: ${values.specialInstructions}`,
                customer_email: values.userData[0].billing.email,
                customer_name: values.userData[0].billing.first_name + ' ' + values.userData[0].billing.last_name,
              });
            }
            changeCreatingOrderStatus(false);
            window.location.href = 'https://rejuve.com/order-confirmation/';
          } catch (error) {
            changeCreatingOrderStatus(false);
            console.error('Error creating order:', error);
          }
        }else{
          setErrorMessage('An error occurred. Please try again.');
          setIsProcessing(false);
          changeCreatingOrderStatus(false);
        }
      }
    } catch (error) {
      console.error('Error in submitForm:', error);
      setErrorMessage('An error occurred. Please try again.');
      setIsProcessing(false);
      changeCreatingOrderStatus(false);
    }
    setIsProcessing(false);
  };
  
  const handleSubmit = (values, options) => {
    const transformedData = organizeLineItems({ values, lineItems });
  };

  const [productPrice, setProductPrice] = useState(
    allPriceForTipPercentage.price || 0
  );

  const handlePercentageChange = (value) => {
    setSelectedTipOption(value);
    setPercentageTip(value);
    setDefaultTip(value);
    setCustomTip(0); // Reset custom tip when a predefined percentage is selected
    // reset the value of the input field
    document.getElementById('tip-input').value = '';
  };

  const handleCustomTipChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value); // Ensure 0 if empty input
    setSelectedTipOption('others');
    setCustomTip(value);
    setPercentageTip(0);
    setDefaultTip(null);
  };
  //  get publish key from rejuve.com/wp-json/stripe/v1/custom-payment-config
  useEffect(() => {
    fetch('https://rejuve.com/wp-json/stripe/v1/stripe-payment-config1', {
      method: 'GET',
    }).then(async (result) => {
      var { publishableKey } = await result.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    stripePromise && (
      <Elements stripe={stripePromise}>
        <section>
          {(isCreatingOrder && (
            <div
              className="loading-rejuve-spinner"
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100%',
                mixBlendMode: 'multiply',
                borderRadius: '500px',
              }}
            >
              <img src="http://rejuve.md/wp-content/themes/rejuve/assets/images/Pill-spinning.gif" />
            </div>
          )) || (
            <FormSection
              tips={{
                customTip,
                percentageTip,
              }}
              lineItems={lineItems}
              setlineItems={setlineItems}
              treatments={treatments}
              providers={providers}
              selectedProvider={selectedProvider}
              handleProviderChange={handleProviderChange}
              handleCustomTipChange={handleCustomTipChange}
              handlePercentageChange={handlePercentageChange}
              defaultTip={defaultTip}
              calculatedTipAmount={calculatedTipAmount}
              selectNad={selectNad}
              updateForm={updateForm}
              fieldsAreEmpty={fieldsAreEmpty}
              fieldsAreEmptyForUpdate={fieldsAreEmptyForUpdate}
              removeFromList={removeFromList}
              submitForm={submitForm}
              handleSubmit={handleSubmit}
              isFetchingProduct={isFetchingProduct}
              currentProduct={currentProductCopy}
              currentMainProduct={currentProductCopy}
              heroCurrentProduct={currentProduct}
              setCurrentProduct={setCurrentProduct}
              setProductPrice={setProductPrice}
              setWhereBooking={setWhereBooking}
              whereBooking={whereBooking}
              tipOptions={{
                selectedTipOption,
                customTip,
              }}
              isProcessingPayment={isProcessing}
              messagePayment={errorMessage}
              setTotalWithTip={setTotalWithTip}
              isScriptLoaded={isScriptLoaded}
              dataPage={dataPage}
            />
          )}
          <ToastContainer position="top-center" transition={Slide} />
        </section>
      </Elements>
    )
  );
}

export default MainAppEntry;
