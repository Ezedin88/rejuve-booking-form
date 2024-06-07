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
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing,setIsProcessing] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  const [totalWithTip, setTotalWithTip] = useState(0);
  const dataPage = document
    .querySelector('[data-page_id]')
    .getAttribute('data-page_id');
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


 const checkMenuTreatments = JSON.parse(localStorage.getItem('selectedTreatments'));
console.log('check treatments===>',checkMenuTreatments);
  const [lineItems, setlineItems] = useState(checkMenuTreatments);
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
      const data = await client.getProductById(dataPage||checkMenuTreatments[0]?.product_id);
      setCurrentProduct(data);
      setCurrentProductCopy(data);
    data?.id!==582 && setlineItems([
      ...lineItems,
        {
          userIndex: 0,
          product_id: data.id,
          productName: data.name,
          variation_id:
            values.bookingChoice !== 'atourclinics'
              ? data?.variations[1]
              : data?.variations[0],
          price: values.bookingChoice === 'housecall' ? bookHouseCall : data.price,
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

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch("https://rejuve.md/wp-json/stripe/v1/create-payment-intent", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalWithTip,
            customer_email: values.userData[0].billing.email,
            customer_name: values.userData[0].billing.first_name + ' ' + values.userData[0].billing.last_name,
          })
        });
  
        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.message || 'Failed to fetch client secret');
        }
      } catch (error) {
        setErrorMessage('Error fetching payment intent');
      }
    };
  
    fetchPaymentIntent();
  }, [totalWithTip,values.userData[0].billing.email,values.userData[0].billing.first_name,values.userData[0].billing.last_name]);
  

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
  const allPriceForTipPercentage = lineItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const calculatedTipAmount = Number(customTip) || (Number(allPriceForTipPercentage) * Number(percentageTip)) / 100;

  const changeCreatingOrderStatus = (status) => {
    setIsCreatingOrder(status);
  };
  const submitForm = async (values) => {
    const transformedData = organizeLineItems({ values, lineItems, calculatedTipAmount, providers });
    const { values: dataValues, meta_data, fee_lines } = transformedData || {};
    const dataToSend = dataValues?.userData?.map((item, key) => ({
      status: 'processing',
      payment_method: dataValues.paymentMethod === 'creditCard' ? 'stripe' : 'house',
      payment_method_title: dataValues.paymentMethod === 'creditCard' ? 'Card' : 'House',
      set_paid: false,
      meta_data,
      billing: { ...item.billing, ...dataValues.bookingAddress },
      line_items: item.line_items,
      fee_lines,
    }));
    if (values.paymentMethod === 'creditCard') {
      setIsProcessing(true);

      const {stripe,elements,cardElement} = values?.cardNumberElement;
      
      if(!stripe||!elements){
        return;
      }

      setIsProcessing(true);
      if(clientSecret){
      const {error,paymentIntent} = await stripe.confirmCardPayment(clientSecret,{
        payment_method:{
          card:cardElement
        }});
        
        if(paymentIntent){
          setIsProcessing(false);
          if (dataToSend) {
            try {
              localStorage.removeItem('selectedTreatments');
              window.scrollTo(0, 0);
              changeCreatingOrderStatus(true);
              await client.createOrder(dataToSend);
              changeCreatingOrderStatus(false);
              window.location.href = 'https://rejuve.md/order-confirmation/';
            } catch (error) {
              changeCreatingOrderStatus(false);
              console.error('Error creating order:', error);
            }
          }
        }else{
          setErrorMessage(error?.message||'Payment failed');
          toast(error?.message||'Payment failed',{type:'error'})
        }

      if(error){
        setIsProcessing(false);
        return;
      }
    }
      setIsProcessing(false);

    }else{
      if (dataToSend) {
        try {
          localStorage.removeItem('selectedTreatments');
          window.scrollTo(0, 0);
          changeCreatingOrderStatus(true);
          await client.createOrder(dataToSend);
          changeCreatingOrderStatus(false);
          window.location.href = 'https://rejuve.md/order-confirmation/';
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
 //  get publish key from rejuve.md/wp-json/stripe/v1/custom-payment-config
 useEffect(() => {
  fetch("https://rejuve.md/wp-json/stripe/v1/stripe-payment-config1", {
    method: "GET",
  }).then(async (result) => {
    var { publishableKey } = await result.json();
    setStripePromise(loadStripe(publishableKey));
  });
}, []);

  return (
    stripePromise&&
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
            />
          )}
      <ToastContainer position='top-center' transition={Slide}/>
      </section>
    </Elements>
  )
}

export default MainAppEntry