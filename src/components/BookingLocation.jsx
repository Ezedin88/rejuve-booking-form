import '../bookingLocationStyle.css';
import { ErrorMessage, Field } from "formik";
import CustomInput from "../CustomInput";

function BookingLocation({
  index,
  values,
}) {
  return (
    <div>
      <div className='selection-wrapper'>
        <div className="choose-radio-wrapper">
          <div className='where-span'>
            <Field className="location-radios" type="radio" name={`userData[${index}].Booking`} value="atourclinics" />
           <p className='location-where'> At Our Clinics  <span className='location-span'>At our locations</span></p>
          </div>
        </div>
        <div className="choose-radio-wrapper">
          <div className='where-span'>
            <Field className="location-radios" type="radio" name={`userData[${index}].Booking`} value="wecometoyou" />
         <p className='location-where'>   We Come to You <span className='location-span'>We come to you</span></p>
          </div>
        </div>
      </div>
      {
        values?.userData?.[index]?.Booking === 'atourclinics' &&
        (
        <>
        <Field
          className="select-location-dropdown"
          as="select" name={
          `userData[${index}].clinic`
        }
        >
          <option className='select-location-dropdown' value="">Select a clinic</option>
          <option
          className='select-location-dropdown' value="Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403"
          >
            Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403
          </option>
        </Field>
        {/* <ErrorMessage name={`userData[${index}].clinic`} component="div" className="error" /> */}
        </>
        ) || <div className='address-wrapper'>
          <CustomInput label="Your Address" name={`userData[${index}].bookingAddress.address_1`}
            type="text" />
          <CustomInput label="Your Address2" name={`userData[${index}].bookingAddress.address_2`}
            type="text" />
            <div className="zip-city-wrapper" style={{display:'flex'}}>
          <CustomInput cityStateZip label="City" name={`userData[${index}].bookingAddress.city`} type="text" />
          <CustomInput cityStateZip label="State" name={`userData[${index}].bookingAddress.state`} type="text" />
          <CustomInput cityStateZip label="Postcode" name={`userData[${index}].bookingAddress.postcode`} type="text" />
          {/* <CustomInput label="Country" name={`userData[${index}].bookingAddress.country`} type="text" /> */}
          </div>
        </div>
      }
    </div>
  );
}

export default BookingLocation;