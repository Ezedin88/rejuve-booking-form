import propTypes from 'prop-types';
import {ErrorMessage,useField, useFormikContext} from "formik";
import CustomDatepicker from './components/CustomDatepicker';
import TimePicker from './components/CustomTimepicker';

const CustomInput = ({label,placeholder,cityStateZip,...props})=>{
    const [field,meta] = useField(props);
    return(
        <>
        {
            // if radio
        props.type==='radio'&&
            <div className="radio-input-wrapper">
                <div className="radio-box">
                    <input {...field} {...props} autoComplete="true" className='payment-radio-input'/>
                </div>
                <p className="radio-input-label">
                    {label}
                </p>
            </div>
            // if text area
            ||props.type==='textArea' &&
            <div className="text-area-wrapper-input">
                <div className='text-area-label' htmlFor={field.name}>{label}</div>
                <textarea placeholder={placeholder} {...field} {...props} autoComplete="true" className='special-instructions-text-area'/>
            </div>
        }
        <div className={cityStateZip?'cityStateZip':'input-box-wrapper'}>
            {props.type!=='radio'&&props.type!=='textArea'&& props.type!=='date'&&
            props.type!=='time'&&
            <div className="label-input-wrapper">   
            <label className='input-box-label' htmlFor={field.name}>{label}</label>       
            <input placeholder={placeholder} {...field} {...props} autoComplete="true" className={props.name==='bookingAddress.address_1'? 'input-box your_address_style':'input-box'} />
            </div>}
            {
                props.type === 'time'&&
                <div className="label-input-wrapper">   
                <label className='input-box-label' htmlFor={field.name}>{label}</label>       
                <TimePicker htmlFor={field.name} {...field} {...props}/>
                </div>
            }
            {
                props.type === 'date'&&
                <div className="label-input-wrapper">   
                <label className='input-box-label' htmlFor={field.name}>{label}</label>       
                <CustomDatepicker htmlFor={field.name} {...field} {...props}/>
                </div>
            }
            <ErrorMessage 
            className='input-box-error-message' component="div" name={field.name} style={errorMessage}/>
        </div>
        </>
    )
}

const errorMessage = {
    color:"red",
    position:"absolute",
    fontSize:"11px"
}

export default CustomInput;

CustomInput.propTypes = {
    label:propTypes.string.isRequired,
    placeholder:propTypes.string,
    cityStateZip:propTypes.bool,
    props:propTypes.object,
    ref:propTypes.object,
    type:propTypes.string
}