import { useEffect, useState } from 'react'
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import CustomInput from "./CustomInput";
import { handleValidation } from "./Validation";
import { initialValues } from './initialValues';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import './App.css'
import TwistAccordion from './Accordion/AccordionComponent';
import { client } from './api/client';
import UserDetail from './components/UserDetail';
import ChooseTreatments from './components/ChooseTreatments';
import Providers from './components/Providers';
import BookingDateTime from './components/BookingDateTime';
import AlmostDoneSection from './components/AlmostDone';
import CardPaymentMethod from './components/CardPaymentMethod';
import Agreement from './components/Agreement';
import BookingLocation from './components/BookingLocation';

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
  const [agreeToTos, setAgreeToTos] = useState(false);
  const [agreeToCreateAccount, setAgreeToCreateAccount] = useState(true);
  const [agreeToSignUp, setAgreeToSignUp] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({});
  const selectNad = treatments.filter(item => item.categories.some(category => category.slug === 'nad'));
  const selectAdons = treatments.filter(item => item.categories.some(category => category.slug === 'ad-ons'));
  const selectBooster = treatments.filter(item => item.categories.some(category => category.slug === 'booster'));
  const selectVitaminInjections = treatments.filter(item => item.categories.some(category => category.slug === 'vitamin-injections'));
  const selectAdvancedTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'advanced-therapies'));
  const selectIvTherapies = treatments.filter(item => item.categories.some(category => category.slug === 'iv-therapy'));
  const [address1, setAddress1] = useState('');
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
      const data = await client.getProductById(108);
      setCurrentProduct(data);
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
    console.log({lineItems,values});
    
  };

  const [defaultTip, setDefaultTip] = useState(5);
  const [percentageTip, setPercentageTip] = useState(5);
  const [customTip, setCustomTip] = useState(0);
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

  const calculatedTipAmount = Number(customTip) || (Number(currentProduct?.price) * Number(percentageTip)) / 100;

  return (
    <>
      <Formik
        validationSchema={handleValidation}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => (
          <Form>
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
                      <div>
                        <ChooseTreatments
                          selectNad={selectNad}
                          index={index}
                          lineItems={lineItems}
                          setlineItems={setlineItems}
                          title={selectNad[0]?.categories[0]?.name} />
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

export default App
