import React from 'react'
import '../inputStyles.css';
import CustomInput from '../CustomInput'

function UserDetail({index}) {
    return (
        <div className='user-input-wrapper'>
            <CustomInput placeholder='Johnathan' label="First Name" name={`userData[${index}].billing.first_name`} type="text" />
            <CustomInput placeholder='Smith' label="Last Name" name={`userData[${index}].billing.last_name`} type="text" />
            <CustomInput placeholder='jonathan.s@gmail.com' label="Email" name={`userData[${index}].billing.email`} type="email" />
            <CustomInput placeholder='Phone number' label="Phone" name={`userData[${index}].billing.phone`} type="text" />
            <CustomInput placeholder='07/19/19' label="Date of Birth" name={`userData[${index}].billing.dateOfBirth`} type="date" />

            {/* <CustomInput placeholder='Enter a location' label="Address 1" placeholder='address' name={`userData[${index}].billing.address_1`} type="text" /> */}

            {/* <CustomInput placeholder='Apartment, Suite, etc.' label="Address 2" placeholder='address' name={`userData[${index}].billing.address_2`} type="text" /> */}

            {/* <CustomInput label="Zip Code" name={`userData[${index}].billing.postcode`} type="text" /> */}
            {/* <CustomInput label="State" name={`userData[${index}].billing.state`} type="text" /> */}
            {/* <CustomInput label="Country" name={`userData[${index}].billing.country`} type="text" /> */}
            {/* <CustomInput label="City" name={`userData[${index}].billing.city`} type="text" /> */}
        </div>
    )
}

export default UserDetail