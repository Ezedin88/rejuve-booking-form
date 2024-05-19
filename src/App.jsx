import { useEffect, useState } from 'react'
import './App.css'
import { client } from './api/client';
import FormSection from './components/FormSection';
import ProductHero from './components/ProductHero';
import { Formik, useFormik } from 'formik';
import { initialValues } from './initialValues';
import { getProductPrice } from './utils/getProductPrice';
function App() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [defaultTip, setDefaultTip] = useState(5);
  const [percentageTip, setPercentageTip] = useState(5);
  const [customTip, setCustomTip] = useState(0);
  const [address1, setAddress1] = useState('');
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [whereBooking, setWhereBooking] = useState('atourclinics');

  // const dataPage = document.querySelector('[data-page_id]').getAttribute('data-page_id');
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
  const [fieldsAreEmptyForUpdate, setFieldsAreEmptyForUpdate] = useState(false);
  const [fieldsAreEmpty, setFieldsAreEmpty] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('Any');

  const [currentProduct, setCurrentProduct] = useState({});
  const [currentProductCopy, setCurrentProductCopy] = useState({});
  const selectNad = treatments.filter(item => item.categories.some(category => category.slug === 'nad'));
 

  const providerId = providers.find(provider => provider.name === selectedProvider)?.id;

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

const {values} = useFormik({initialValues})
  useEffect(() => {
    const {bookHouseCall,bookInClinic} = getProductPrice({ product: currentProduct, isFetchingProduct })||{};
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
      setCurrentProductCopy(data);
      setlineItems([{
        userIndex: 0,
        product_id: data.id,
        productName: data.name,
        price: whereBooking === 'housecall' ? bookHouseCall : data.price,
        quantity: 1,
        metaData: []
      }]);
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

  const checkEmptyFields = async (values) => {

  }

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


  function organizeLineItems(data) {
    // Ensure userData array exists and is not empty
    if (!data.values.userData || data.values.userData.length === 0) {
        return;
    }
    data.values.userData.forEach((user, index) => {
        organizeItems(user, data.lineItems, index,data.values);
    });

    return {...data,...{
      fee_lines:[
        {
          name:'Tip',
          tax_class:'',
          tax_status:'taxable',
          total: String(calculatedTipAmount)
        }
      ],
      meta_data:[
        {
          key:'providerinfo',
          value:{
            id:providerId,
            time:data?.values?.bookingTime,
            date:data?.values?.bookingDate
          }
        }
      ]
    }};
}
function organizeItems(user, lineItems, userIndex,values) {
  const meta = (index, name) => ({
    key: 'Name',
    value: name || `Person ${index + 1} Person ${index + 1}`,
  });
  if (userIndex) {
    user.line_items = lineItems
      .filter((item) => item.userIndex == userIndex)
      .map((item) => {
        return {
          ...item,
          meta_data: [meta(0)],
        };
      });
    return;
  }
  user.line_items = lineItems.map((item) => {
    return {
      ...item,
      meta_data: [
        {
          key: 'type',
          value: values.Booking,
        },
        {
          key:'Provider',
          value:selectedProvider
        },
        userIndex === item.userIndex
          ? meta(
              0,
              `${user.billing.first_name} ${user.billing.last_name}`,
            )
          : meta(item.userIndex),
      ]
    };
  });
  return;
}

  const submitForm = (values) => {
  const transformedData = organizeLineItems({values,lineItems})
  const {values:dataValues,meta_data,fee_lines} = transformedData||{};
  const dataToSend = dataValues?.userData?.map((item,key)=>({
    meta_data,
    billing:item?.billing,
    line_items:item?.line_items,
    fee_lines
  }));

  if(dataToSend){
    // createorder
    client.createOrder(dataToSend)
  }

  }


  const handleSubmit = (values,options) => {
   const transformedData = organizeLineItems({values,lineItems})
  };

  
  const allPriceForTipPercentage = lineItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  const [productPrice, setProductPrice] = useState(allPriceForTipPercentage.price || 0);
  const handlePercentageChange = (value) => {
    if (value === "custom") {
      return customTip;
    } else {
      // target input called tip-input and set the value to 0
      document.getElementById('tip-input').value = 'tip'; 
      setPercentageTip(value);
      setDefaultTip(value);
      setCustomTip(0);
    }
  }
  
  const handleCustomTipChange = (e) => {
    document.querySelectorAll('input[type="radio"].tip-radio').forEach(radio => {
      radio.checked = false;
  });

    setCustomTip(e.target.value);
    setDefaultTip(null);
    handlePercentageChange("custom");
  }

  const calculatedTipAmount = Number(customTip) || (Number(productPrice) * Number(percentageTip)) / 100;
  return (
    <section>
      <FormSection
      tips={{
        customTip,
        percentageTip
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
      />
    </section>
  )
}

export default App
