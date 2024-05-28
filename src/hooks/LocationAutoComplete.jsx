import { useFormikContext } from "formik";
import { useState } from "react";
import { geocodeByAddress } from "react-places-autocomplete";

function useLocationAutoComplete() {
    const [address, setAddress] = useState('');
    const [extractedAddressData, setExtractedAddressData] = useState({});
    const [formattedAddress,setFormattedAddress] = useState('');
    const {setFieldValue,setFieldTouched} = useFormikContext();
    const handleChange = address => {
        setAddress(address);
        setFieldValue('bookingAddress.address_1',address);
        setFieldTouched('bookingAddress.address_1',true);
      };
    
      const handleSelect = address => {
        geocodeByAddress(address)
            .then(results => {
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
    }
}

export default useLocationAutoComplete