import { useEffect, useState } from 'react';
import './App.css';
import { client } from './api/client';
import FormSection from './components/FormSection';
import ProductHero from './components/ProductHero';
import { Formik, useFormik } from 'formik';
import { initialValues } from './initialValues';
import { getProductPrice } from './utils/getProductPrice';
function App() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState('others');
  const [defaultTip, setDefaultTip] = useState(0);
  const [percentageTip, setPercentageTip] = useState(0);
  const [customTip, setCustomTip] = useState(0);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [whereBooking, setWhereBooking] = useState('atourclinics');

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

  const [lineItems, setlineItems] = useState([]);
  const [fieldsAreEmptyForUpdate, setFieldsAreEmptyForUpdate] = useState(false);
  const [fieldsAreEmpty, setFieldsAreEmpty] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [providers, setProviders] = useState([]);
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
      const data = await client.getProductById(dataPage);
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

  const checkEmptyFields = async (values) => {};

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

  function organizeLineItems(data) {
    // Ensure userData array exists and is not empty
    const providerId = providers.find(
      (provider) => provider.name === data?.values?.provider
    )?.id;
    if (!data.values.userData || data.values.userData.length === 0) {
      return;
    }

    data.values.userData.forEach((user, index) => {
      organizeItems(user, data.lineItems, index, data.values);
    });

    return {
      ...data,
      fee_lines: [
        {
          name: 'Tip',
          tax_class: '',
          tax_status: 'taxable',
          total: String(calculatedTipAmount),
        },
      ],
      meta_data: [
        {
          key: 'providerinfo',
          value: {
            id: providerId,
            time: data?.values?.bookingTime,
            date: data?.values?.bookingDate,
          },
        },
      ],
    };
  }

  function organizeItems(user, lineItems, userIndex, values) {
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
      const bookingPlace =
        values?.bookingChoice === 'housecall' ? 'house' : 'clinic';

      // if (bookingPlace === 'clinic') {
      //     const fieldsToDelete = ['address_1', 'address_2', 'city', 'state', 'postcode'];
      //     fieldsToDelete.forEach(field => {
      //         delete user.billing[field];
      //     });
      // }

      const metaDataArray = [
        {
          key: 'type',
          value:
            values?.bookingChoice === 'housecall' ? 'house call' : 'clinic',
        },
        {
          key: 'Provider',
          value: values?.provider,
        },
        userIndex === item.userIndex
          ? meta(0, `${user.billing.first_name} ${user.billing.last_name}`)
          : meta(item.userIndex),
        {
          key: 'Booking',
          value: bookingPlace,
        },
      ];

      if (bookingPlace === 'clinic') {
        metaDataArray.push({
          key: 'Clinic Choice',
          value: values?.clinicChoice,
        });
      }

      // Filter out any falsy values from meta_data array
      const filteredMetaData = metaDataArray.filter(Boolean);

      return {
        ...item,
        meta_data: filteredMetaData,
      };
    });

    return;
  }

  const changeCreatingOrderStatus = (status) => {
    setIsCreatingOrder(status);
  };

  const submitForm = async (values) => {
    const transformedData = organizeLineItems({ values, lineItems });
    const { values: dataValues, meta_data, fee_lines } = transformedData || {};
    const dataToSend = dataValues?.userData?.map((item, key) => ({
      status: 'processing',
      payment_method:
        dataValues.paymentMethod === 'creditCard' ? 'credit card' : 'house',
      meta_data,
      billing: { ...item.billing, ...dataValues.bookingAddress },
      line_items: item.line_items,
      fee_lines,
    }));

    if (dataToSend) {
      try {
        // Set order status to creating
        window.scrollTo(0, 0);
        changeCreatingOrderStatus(true);
        // Create the order
        await client.createOrder(dataToSend);
        // Set order status to not creating after successful order creation
        changeCreatingOrderStatus(false);
        window.location.href = 'https://rejuve.md/order-confirmation/';
      } catch (error) {
        // Set order status to not creating in case of an error
        changeCreatingOrderStatus(false);
        console.error('Error creating order:', error);
      }
    }
  };

  const handleSubmit = (values, options) => {
    const transformedData = organizeLineItems({ values, lineItems });
  };

  const allPriceForTipPercentage = lineItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
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

  const calculatedTipAmount =
    Number(customTip) ||
    (Number(allPriceForTipPercentage) * Number(percentageTip)) / 100;
  return (
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
  );
}

export default App;
