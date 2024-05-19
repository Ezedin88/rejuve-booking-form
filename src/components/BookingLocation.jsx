import '../bookingLocationStyle.css';
import { ErrorMessage, Field } from "formik";
import CustomInput from "../CustomInput";

function BookingLocation({
  index,
  values,
  setWhereBooking,
}) {
  console.log('vals==>',values)
  return (
    <div>
      <div className='selection-wrapper'>
        <div className="choose-radio-wrapper">
          <div className='where-span'>
            <Field className="location-radios" type="radio" name={`userData[${index}].Booking`} value="atourclinics"
            />
           <p className='location-where'> At Our Clinics  <span className='location-span'>At our locations</span></p>
          </div>
        </div>
        <div className="choose-radio-wrapper">
          <div className='where-span'>
            <Field className="location-radios" type="radio" name={`userData[${index}].Booking`} value="housecall" />
         <p className='location-where'>   We Come to You <span className='location-span'>We come to you</span></p>
          </div>
        </div>
      </div>
      {
        values?.userData?.[index]?.Booking === 'atourclinics' &&
        (
        <div className='select-clinic-wrapper'>
        <Field
          className="select-location-dropdown"
          as="select" name={
          `userData[${index}].clinic`
        }
        >
          <option className='select-location-dropdown' value="">
          <p>Select a clinic</p>
          </option>
          <option
          className='select-location-dropdown' value="Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403"
          >
            Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403
          </option>
        </Field>
          <img className='location-icon' src="/src/assets/location-icon.svg" /> 
        <ErrorMessage name={`userData[${index}].clinic`} component="div" className="error-clinic-selection input-box-error-message" />
        </div>
        ) || <div className='address-wrapper'>
          <CustomInput label="Your Address" name={`userData[${index}].billing.address_1`}
            type="text" />
          <CustomInput label="Your Address2" name={`userData[${index}].billing.address_2`}
            type="text" />
            <div className="zip-city-wrapper" style={{display:'flex'}}>
          <CustomInput cityStateZip label="City" name={`userData[${index}].billing.city`} type="text" />
          <CustomInput cityStateZip label="State" name={`userData[${index}].billing.state`} type="text" />
          <CustomInput cityStateZip label="Postcode" name={`userData[${index}].billing.postcode`} type="text" />
          </div>
        </div>
      }
    </div>
  );
}

export default BookingLocation;