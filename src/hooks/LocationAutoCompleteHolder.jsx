import { useFormikContext } from "formik";
import { useState } from "react";
import { geocodeByAddress } from "react-places-autocomplete";

function useLocationAutoComplete() {
    const [address, setAddress] = useState('');
    const [extractedAddressData, setExtractedAddressData] = useState({
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });
    const [formattedAddress, setFormattedAddress] = useState('');
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const handleChange = address => {
        setAddress(address);
        setFieldValue('biller_details.address.line1', address);
        setFieldTouched('biller_details.address.line1', true);
    };

    const handleSelect = address => {
        const currentRequest = geocodeByAddress(address);

        currentRequest.then(results => {
            const addressComponents = results[0].address_components;
            const formattedAddress = results[0].formatted_address;
            const extractedData = {
                address: "",
                city: "",
                country: "",
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
                if (types.includes("country")) {
                    extractedData.country = component.long_name;
                }
            });

            extractedData.address = `${streetNumber} ${route}`.trim();

            setExtractedAddressData(extractedData);
            setFormattedAddress(formattedAddress);
            formattedAddress && setAddress(formattedAddress);
            setFieldValue('biller_details.address.line1', formattedAddress || '');
            setFieldValue('biller_details.address.city', extractedData.city || '');
            setFieldValue('biller_details.address.state', extractedData.state || '');
            setFieldValue('biller_details.address.postal_code', extractedData.zip || '');
            setFieldValue('biller_details.address.country', extractedData.country || '');
        }).catch(error => {
            console.error("Geocode error: ", error);
        });
    };

    const handleAddressBlur = () => {
        setFieldValue('biller_details.address.line1', formattedAddress);
        setFieldTouched('biller_details.address.line1', true);
    };

    const handleStateChange = (e) => {
        const { value } = e.target;
        setFieldValue('biller_details.address.state', value);
    };

    const handleZipChange = (e) => {
        const { value } = e.target;
        setFieldValue('biller_details.address.postal_code', value);
    };

    return {
        handleChange,
        handleSelect,
        extractedAddressData,
        address,
        formattedAddress,
        handleAddressBlur,
        handleStateChange,
        handleZipChange
    };
}

export default useLocationAutoComplete;
