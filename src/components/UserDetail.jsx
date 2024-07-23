import propTypes from 'prop-types';
import '../inputStyles.css';
import CustomInput from '../CustomInput'

function UserDetail({ index }) {
    return (
        <div className='single-page-user-info-wrapper'>
            <div className='user-input-wrapper'>
                <CustomInput placeholder='Johnathan' label="First Name" name={`userData[${index}].billing.first_name`} type="text" />
                <CustomInput placeholder='Smith' label="Last Name" name={`userData[${index}].billing.last_name`} type="text" />
            </div>
            <div className='user-input-wrapper'>
                <CustomInput placeholder='jonathan@gmail.com' label="Email" name={`userData[${index}].billing.email`} type="email" />
                <CustomInput placeholder='(123) 456-7890' label="Phone" name={`userData[${index}].billing.phone`} type="text" />
            </div>
            <CustomInput placeholder='07/19/19' label="Date of Birth" name={`userData[${index}].billing.dateOfBirth`} type="date" dateOfBirth />
        </div>
    )
}

export default UserDetail;

UserDetail.propTypes = {
    index: propTypes.number
}