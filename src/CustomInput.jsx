import {ErrorMessage,useField} from "formik";

const CustomInput = ({label,...props},ref)=>{
    const [field] = useField(props);
    return(
        <div style={{width:'100%'}}>
            <label htmlFor={field.name}>{label}</label>
            <input {...field} {...props} autoComplete="true"/>
            <ErrorMessage component="div" name={field.name} style={errorMessage}/>
        </div>
    )
}

const errorMessage = {
    color:"red",
    position:"absolute",
    fontSize:"11px"
}

export default CustomInput;