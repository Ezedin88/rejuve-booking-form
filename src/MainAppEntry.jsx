import { useEffect, useState } from 'react';
import './App.css';
import { client } from './api/client';
import FormSection from './components/FormSection';
import ProductHero from './components/ProductHero';
import { Formik, useFormik } from 'formik';
import { initialValues } from './initialValues';
import { getProductPrice } from './utils/getProductPrice';
import { CardElement, CardNumberElement, Elements, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { organizeLineItems } from './utils/organizeLineitems';
import {useStripe} from '@stripe/react-stripe-js';

function MainAppEntry() {
  const StripeConfirm = useStripe();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState('others');
  const [defaultTip, setDefaultTip] = useState(0);
  const [percentageTip, setPercentageTip] = useState(0);
  const [customTip, setCustomTip] = useState(0);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [whereBooking, setWhereBooking] = useState('atourclinics');
  const [providers, setProviders] = useState([]);
  const elements = useElements();
  const cardElement = elements?.getElement(CardNumberElement);
  console.log('card element==>',cardElement)
  // stripe with secret key
  // const dataPage = document
  //   .querySelector('[data-page_id]')
  //   .getAttribute('data-page_id');
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBiMgA18QMFdnj67qadAYRk816SdI8c8ag&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      setIsScriptLoaded(true);
    });
    document.body.appendChild(script);
  }, []);

  const isFormFilled = (values) => {
    // Check if any of the fields in the current form are empty
    return values.userData.every((item) =>
      Object.values(item.billing).every((field) => field !== '')
    );
  };

  const [lineItems, setlineItems] = useState([]);
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
    const { bookHouseCall, bookInClinic } =
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
      const data = await client.getProductById(108);
      setCurrentProduct(data);
      setCurrentProductCopy(data);
      setlineItems([
        {
          userIndex: 0,
          product_id: data.id,
          productName: data.name,
          variation_id:
            whereBooking === 'housecall'
              ? data?.variations[1]
              : data?.variations[0],
          price: whereBooking === 'housecall' ? bookHouseCall : data.price,
          quantity: 1,
          metaData: [],
        },
      ]);
      setIsFetchingProduct(false);
    };
    fetchProductById();
    fetchProviders();
    fetchTreatments();
  }, []);

  const removeFromList = (index, values, setValues) => {
    const userData = [...values.userData];
    userData.splice(index, 1);
    setValues({ ...values, userData });
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  const checkEmptyFields = async (values) => { };

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
  const allPriceForTipPercentage = lineItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const calculatedTipAmount = Number(customTip) || (Number(allPriceForTipPercentage) * Number(percentageTip)) / 100;

  const theTotalPriceAmount = allPriceForTipPercentage + calculatedTipAmount;
console.log('the total',theTotalPriceAmount,allPriceForTipPercentage,calculatedTipAmount)
  const changeCreatingOrderStatus = (status) => {
    setIsCreatingOrder(status);
  };

  const submitForm = async (values) => {
    let paymentIntentId, client_secret;
    let cardPaymentMetaData = {};
    console.log('payment method==>',values.paymentMethod)
    if (values.paymentMethod === 'creditCard') {
      try {
        const { paymentIntentId: id, client_secret: secret } = await client.handlePaymentIntent(theTotalPriceAmount,values);
        paymentIntentId = id;
        client_secret = secret;
        
       cardPaymentMetaData = values.paymentMethod === 'creditCard' ? {
          key: "_stripe_intent_id",
          value: paymentIntentId,
        } : {};
        console.log('success',cardPaymentMetaData)
      } catch (error) {
        console.error('Error handling payment intent:', error);
      }
    }
    let paymentSuccess = true;

    // if (values.paymentMethod === 'creditCard' && client_secret) {
    //   console.log('reached!!!!!')
    //   const paymentMethodDetails = {
    //     payment_method: {
    //       card: values?.theCardElement,
    //       billing_details: {
    //         name: values.userData[0].billing.first_name,
    //         email: values.userData[0].billing.email,
    //         phone: values.userData[0].billing.phone,
    //       },
    //     },
    //   };

    //   try {
    //     const paymentResult = await StripeConfirm.confirmCardPayment(client_secret, paymentMethodDetails);
    //     console.log('payment result==>',paymentResult);
    //     if (paymentResult.error || paymentResult.paymentIntent.status !== 'succeeded') {
    //       paymentSuccess = false;
    //       console.error('Error confirming card payment:', paymentResult.error || 'Payment not successful');
    //     }
    //   } catch (error) {
    //     paymentSuccess = false;
    //     console.error('Error confirming card payment:', error);
    //   }
    // }
    
    if (values.paymentMethod !== 'creditCard' || paymentSuccess) {
      const transformedData = organizeLineItems({ values, lineItems, calculatedTipAmount, providers });
      const { values: dataValues, meta_data, fee_lines } = transformedData || {};
      const dataToSend = dataValues?.userData?.map((item, key) => ({
        status: 'processing',
        payment_method: dataValues.paymentMethod === 'creditCard' ? 'stripe' : 'house',
        payment_method_title: dataValues.paymentMethod === 'creditCard' ? 'Card' : 'House',
        set_paid: false,
        meta_data: [{ ...meta_data, ...cardPaymentMetaData }],
        billing: { ...item.billing, ...dataValues.bookingAddress },
        line_items: item.line_items,
        fee_lines,
      }));
    
      if (dataToSend) {
        try {
          window.scrollTo(0, 0);
          // changeCreatingOrderStatus(true);
          await client.createOrder(dataToSend);
          changeCreatingOrderStatus(false);
          // window.location.href = 'https://rejuve.md/order-confirmation/';
        } catch (error) {
          changeCreatingOrderStatus(false);
          console.error('Error creating order:', error);
        }
      }
    }    
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

  const stripePromise = loadStripe('pk_test_51HFQsEF7hHoyPJTdIvpMJXC7IwKaM7eq4NCaplVU8pw7ti9fWWcPfE7b8ABWv2tUNJgmP1cEgZxqinVBYA7y31mC00e4PgE3PH');
  return (
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
            />
          )}
      </section>
    </Elements>
  )
}

export default MainAppEntry