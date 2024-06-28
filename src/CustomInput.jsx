import propTypes from 'prop-types';
import { ErrorMessage, useField } from 'formik';
import CustomDatepicker from './components/CustomDatepicker';
import TimePicker from './components/CustomTimepicker';

const CustomInput = ({
  label,
  placeholder,
  cityStateZip,
  dateOfBirth,
  availableDates,
  availableTimes,
  mergedDates,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <>
      {
        // if radio
        (props.type === 'radio' && (
          <div className="radio-input-wrapper">
            <div className="radio-box">
              <input
                {...field}
                {...props}
                autoComplete="true"
                className="payment-radio-input"
              />
            </div>
            <p
              className="radio-input-label"
              onClick={() =>
                field.onChange({
                  target: { name: field.name, value: field.value },
                })
              }
              style={{ cursor: 'pointer' }}
            >
              {label}
            </p>
          </div>
        )) ||
          // if text area
          (props.type === 'textArea' && (
            <div className="text-area-wrapper-input">
              <div className="text-area-label in-product-page" htmlFor={field.name}>
                {label}
              </div>
              <textarea
                placeholder={placeholder}
                {...field}
                {...props}
                autoComplete="true"
                className="special-instructions-text-area"
              />
            </div>
          ))
      }
      {props.type !== 'radio' &&
        props.type !== 'textArea' &&
        props.type !== 'date' &&
        props.type !== 'time' && (
<div className={`${cityStateZip ? 'cityStateZip' : 'input-box-wrapper'} the-product-page`}>
              <div className="label-input-wrapper">
              <label className="input-box-label" htmlFor={field.name}>
                {label}
              </label>
              <input
                placeholder={placeholder}
                {...field}
                {...props}
                autoComplete="true"
                className={`${props.className ? props.className : ''} ${props.name === 'bookingAddress.address_1' ? 'input-box' : 'input-box'}`}
              />
            </div>
            <ErrorMessage
              className="input-box-error-message"
              component="div"
              name={field.name}
              style={{}}
            />
          </div>
        )}

      {props.type === 'time' && (
          <div className={`${cityStateZip ? 'cityStateZip' : 'input-box-wrapper'} the-product-page`}>
          <div className="label-input-wrapper">
            <label className="input-box-label" htmlFor={field.name}>
              {label}
            </label>
            <TimePicker
              availableTimes={availableTimes}
              mergedDates={mergedDates}
              htmlFor={field.name}
              {...field}
              {...props}
            />
          </div>
          <ErrorMessage
            className="input-box-error-message"
            component="div"
            name={field.name}
            style={{}}
          />
        </div>
      )}

      {props.type === 'date' && (
        <div className={`${cityStateZip ? 'cityStateZip' : 'input-box-wrapper'}
          ${dateOfBirth && 'birth-date-input-box'}
          the-product-page
        `}>
          <div className="label-input-wrapper">
            <label className={`input-box-label ${dateOfBirth && 'birth-date-label'}`} htmlFor={field.name}>
              {label}
            </label>
            <CustomDatepicker
              availableDates={availableDates}
              mergedDates={mergedDates}
              dateOfBirth={dateOfBirth}
              htmlFor={field.name}
              {...field}
              {...props}
            />
          </div>
          <ErrorMessage
            className="input-box-error-message"
            component="div"
            name={field.name}
            style={{}}
          />
        </div>
      )}
    </>
  );
};
// const errorMessage = {
//     color: "red",
//     position: "absolute",
//     fontSize: "11px"
// }

export default CustomInput;

CustomInput.propTypes = {
  label: propTypes.string.isRequired,
  placeholder: propTypes.string,
  cityStateZip: propTypes.bool,
  props: propTypes.object,
  ref: propTypes.object,
  type: propTypes.string,
};
