
import {ErrorMessage,useField} from "formik";

const CustomInput = ({label,placeholder,cityStateZip,...props},ref)=>{
    const [field] = useField(props);
    return(
        <>
        {props.type==='radio'&&
            <div className="radio-input-wrapper">
                <div className="radio-box">
                    <input {...field} {...props} autoComplete="true" className='payment-radio-input'/>
                </div>
                <p className="radio-input-label">
                    {label}
                </p>
            </div>
            ||props.type==='textArea' &&
            <div className="text-area-wrapper-input">
                <div className='text-area-label' htmlFor={field.name}>{label}</div>
                <textarea placeholder={placeholder} {...field} {...props} autoComplete="true" className='special-instructions-text-area'/>
            </div>
        }
        <div className={cityStateZip?'cityStateZip':'input-box-wrapper'}>
            {props.type!=='radio'&&props.type!=='textArea'&&<div className="label-input-wrapper">   
            <label className='input-box-label' htmlFor={field.name}>{label}</label>        
            <input placeholder={placeholder} {...field} {...props} autoComplete="true" className='input-box'/>
            </div>}
            <ErrorMessage className='input-box-error-message' component="div" name={field.name} style={errorMessage}/>
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