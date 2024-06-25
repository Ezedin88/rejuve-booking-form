import { useFormikContext } from "formik";
import { useState, useEffect, useRef } from "react";
import { geocodeByAddress } from "react-places-autocomplete";

function useLocationAutoComplete() {
     const [address, setAddress] = useState('');
    const [extractedAddressData, setExtractedAddressData] = useState({
        address: '',
        city: '',
        state: '',
        zip: ''
    });
    const [formattedAddress, setFormattedAddress] = useState('');
    const { setFieldValue, setFieldTouched } = useFormikContext();
    const latestRequestRef = useRef(null);
    useEffect(() => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData'));
        if (bookingData && bookingData.bookingAddress) {
            const { address_1, city, state, postcode } = bookingData.bookingAddress;
            const initialAddressData = {
                address: address_1 || '',
                city: city || '',
                state: state || '',
                zip: postcode || ''
            };
            setExtractedAddressData(initialAddressData);
            setFormattedAddress(address_1 || '');
            setAddress(address_1 || '');

            // Set initial form values
            setFieldValue('bookingAddress.address_1', address_1 || '');
            setFieldValue('bookingAddress.city', city || '');
            setFieldValue('bookingAddress.state', state || '');
            setFieldValue('bookingAddress.postcode', postcode || '');
        }
    }, [setFieldValue]);

    const handleChange = address => {
        setAddress(address);
        setFieldValue('bookingAddress.address_1', address);
        setFieldTouched('bookingAddress.address_1', true);
    };

    const handleSelect = address => {
        const currentRequest = geocodeByAddress(address);
        latestRequestRef.current = currentRequest;

        currentRequest.then(results => {
            // Ignore outdated requests
            if (currentRequest !== latestRequestRef.current) return;

            const addressComponents = results[0].address_components;
            const formattedAddress = results[0].formatted_address;
            const extractedData = {
                address: "",
                city: "",
                state: "",
                zip: ""
            };

            let streetNumber = "";
            let route = "";

            addressComponents.forEach((component) => {
                const types = component.types;
                if (types.includes("street_number")) {
                    streetNumber = component.long_name;
                }
                if (types.includes("route")) {
                    route = component.long_name;
                }
                if (types.includes("locality")) {
                    extractedData.city = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                    extractedData.state = component.long_name;
                }
                if (types.includes("postal_code")) {
                    extractedData.zip = component.long_name;
                }
            });

            // Combine street number and route
            extractedData.address = `${streetNumber} ${route}`.trim();

            setExtractedAddressData(extractedData);
            setFormattedAddress(formattedAddress);
            setAddress(extractedData);

            // Update form values
            setFieldValue('bookingAddress.address_1', formattedAddress||JSON.parse(localStorage.getItem('bookingData')).bookingData.bookingAddress.address_1)??'';
            setFieldValue('bookingAddress.city', extractedData.city);
            setFieldValue('bookingAddress.state', extractedData.state);
            setFieldValue('bookingAddress.postcode', extractedData.zip);
        }).catch(error => {
            console.error("Geocode error: ", error);
        });
    };

    const handleAddressBlur = () => {
        setFieldTouched('bookingAddress.address_1', true);
    };

    return {
        handleChange,
        handleSelect,
        extractedAddressData,
        address,
        formattedAddress,
        handleAddressBlur
    };
}

export default useLocationAutoComplete;
