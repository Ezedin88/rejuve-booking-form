import '../inputStyles.css';
import CustomInput from '../CustomInput'

function UserDetail({index}) {
    //  const userDataBillingInformation = values?.userData?.map(
    //         (item) => item.billing
    //       )
    //       console.log('values===>',userDataBillingInformation)
    return (
        <div className='user-input-wrapper'>
            <CustomInput placeholder='Johnathan' label="First Name" name={`userData[${index}].billing.first_name`} type="text" />
            <CustomInput placeholder='Smith' label="Last Name" name={`userData[${index}].billing.last_name`} type="text" />
            <CustomInput placeholder='jonathan.s@gmail.com' label="Email" name={`userData[${index}].billing.email`} type="email" />
            <CustomInput placeholder='Phone number' label="Phone" name={`userData[${index}].billing.phone`} type="text" />
            <CustomInput placeholder='07/19/19' label="Date of Birth" name={`userData[${index}].billing.dateOfBirth`} type="date" dateOfBirth/>

        </div>
    )
}

export default UserDetail