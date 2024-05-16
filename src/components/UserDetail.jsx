import React from 'react'
import CustomInput from '../CustomInput'

function UserDetail({index}) {
    return (
        <div>
            <CustomInput label="First Name" name={`userData[${index}].billing.first_name`} type="text" />
            <CustomInput label="Last Name" name={`userData[${index}].billing.last_name`} type="text" />
            <CustomInput label="Email" name={`userData[${index}].billing.email`} type="email" />
            <CustomInput label="Phone" name={`userData[${index}].billing.phone`} type="text" />
            <CustomInput label="Date of Birth" name={`userData[${index}].billing.dateOfBirth`} type="date" />

            <CustomInput label="Address 1" name={`userData[${index}].billing.address_1`} type="text" />

            <CustomInput label="Address 2" name={`userData[${index}].billing.address_2`} type="text" />

            <CustomInput label="City" name={`userData[${index}].billing.city`} type="text" />
            <CustomInput label="State" name={`userData[${index}].billing.state`} type="text" />
            <CustomInput label="Postcode" name={`userData[${index}].billing.postcode`} type="text" />
            <CustomInput label="Country" name={`userData[${index}].billing.country`} type="text" />
        </div>
    )
}

export default UserDetail