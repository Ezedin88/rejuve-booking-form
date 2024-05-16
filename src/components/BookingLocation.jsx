import { Field } from "formik";
import CustomInput from "../CustomInput";

function BookingLocation({
    index,
    values,
}) {
    return (
        <div>
      <div>
                <label>
                  <Field type="radio" name={`userData[${index}].Booking`} value="atourclinics" />
                  At Our Clinics
                </label>
                <label>
                  <Field type="radio" name={`userData[${index}].Booking`} value="wecometoyou" />
                  We Come to You
                </label>
              </div>
              {
                values?.userData?.[index]?.Booking==='atourclinics'&&
                (<Field as="select" name={
                  `userData[${index}].clinic`
                } 
                >
                <option value="">Select a clinic</option>
                <option value="Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403">
                  Rejuve Clinics Sherman Oaks, 15301 Ventura Blvd Unit U2 Sherman Oaks, CA 91403
                </option>
              </Field>
)|| <>
  <CustomInput label="Your Address" name={`userData[${index}].bookingAddress.address_1`}
    type="text" />
     <CustomInput label="Your Address2" name={`userData[${index}].bookingAddress.address_2`}
    type="text" />
  <CustomInput label="City" name={`userData[${index}].bookingAddress.city`} type="text" />
  <CustomInput label="State" name={`userData[${index}].bookingAddress.state`} type="text" />
  <CustomInput label="Postcode" name={`userData[${index}].bookingAddress.postcode`} type="text" />
  <CustomInput label="Country" name={`userData[${index}].bookingAddress.country`} type="text" />
</>
              }
        </div>
    );
}

export default BookingLocation;