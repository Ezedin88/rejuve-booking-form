import { useEffect, useState } from 'react'
import './App.css'
import { client } from './api/client';
import FormSection from './components/FormSection';
import ProductHero from './components/ProductHero';
import { Formik, useFormik } from 'formik';

function App() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBiMgA18QMFdnj67qadAYRk816SdI8c8ag&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      setIsScriptLoaded(true);
    })
    document.body.appendChild(script);
  }, []);

  const isFormFilled = (values) => {
    // Check if any of the fields in the current form are empty
    return values.userData.every(item => Object.values(item.billing).every(field => field !== ''));
  };

  const [lineItems, setlineItems] = useState([]);
  const [fieldsAreEmpty, setFieldsAreEmpty] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('Any');
 
  const [currentProduct, setCurrentProduct] = useState({});
  const selectNad = treatments.filter(item => item.categories.some(category => category.slug === 'nad'));
  const selectAdons = treatments.filter(item => item.categories.some(category => category.slug === 'ad-ons'));
  const selectBooster = treatments.filter(item => item.categories.some(category => category.slug === 'booster'));
  const selectVitaminInjections = treatments.filter(item => item.categories.some(category => category.slug === 'vitamin-injections'));
  const selectAdvancedTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'advanced-therapies'));
  const selectIvTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'iv-therapy'));
  const [address1, setAddress1] = useState('');
  const [isFetchingProduct,setIsFetchingProduct] = useState(false);
  // fetch treatments on first page load from client.getAllTreatments
  useEffect(() => {
    const fetchTreatments = async () => {
      const data = await client.getAllTreatments();
      setTreatments(data);
    }
    const fetchProviders = async () => {
      const data = await client.getAllProviders();
      setProviders(data);
    }
    const fetchProductById = async () => {
      setIsFetchingProduct(true);
      const data = await client.getProductById(108);
      setCurrentProduct(data);
      setIsFetchingProduct(false);
    }
    fetchProductById();
    fetchProviders();
    fetchTreatments();
  }, []);

  const removeFromList = (index, values, setValues) => {
    const userData = [...values.userData];
    userData.splice(index, 1);
    setValues({ ...values, userData });
  }

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  }
const [fieldsAreEmptyForUpdate,setFieldsAreEmptyForUpdate] = useState(false);
  const updateForm = (values, setValues) => {
    if (!isFormFilled(values)) {
      setFieldsAreEmptyForUpdate(true);
      return;
    }
    const userData = [...values.userData];
    userData.push({
      billing: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      },
      Booking: 'atourclinics',
      clinic: '',
      bookingAddress: {
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      },
      line_items: [],
      paymentMethod: 'creditCard'
    });
    setValues({
      ...values, userData
      // , provider: selectedProvider

    });
  }

  const submitForm=(values)=>{
      if (!isFormFilled(values)) {
        setFieldsAreEmpty(true);
        return;
      }
      
  }

  const handleSubmit = (values) => {
    
  };

  const [defaultTip, setDefaultTip] = useState(5);
  const [percentageTip, setPercentageTip] = useState(5);
  const [customTip, setCustomTip] = useState(0);
  const [productPrice,setProductPrice] = useState(currentProduct.price||0);
  const handlePercentageChange = (value) => {
    if (value === "custom") {
      return customTip;
    } else {
      setPercentageTip(value);
      setDefaultTip(value);
    }
  }
  const handleCustomTipChange = (e) => {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
    });
    setCustomTip(e.target.value);
    setDefaultTip(null);
    handlePercentageChange("custom");
  }

  const calculatedTipAmount = Number(customTip) || (Number(productPrice) * Number(percentageTip)) / 100;
// take values from formik and pass them to ProductHero
  return (
    <section>
<FormSection
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
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        setProductPrice={setProductPrice}
/>

    </section>
  )
}

export default App
