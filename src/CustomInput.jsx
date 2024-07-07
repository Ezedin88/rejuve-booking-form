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
  const [field] = useField(props);

  const renderInputField = () => {
    switch (props.type) {
      case 'radio':
        return (
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
        );

      case 'textArea':
        return (
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
        );

      case 'date':
        return (
          <div
            className={`${cityStateZip ? 'cityStateZip' : 'input-box-wrapper'} ${dateOfBirth && 'birth-date-input-box'} the-product-page`}
          >
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
        );

      case 'time':
        return (
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
        );

      default:
        return (
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
                className={`${props.className ? props.className : ''} input-box`}
              />
            </div>
            <ErrorMessage
              className="input-box-error-message"
              component="div"
              name={field.name}
              style={{}}
            />
          </div>
        );
    }
  };

  return <>{renderInputField()}</>;
};

CustomInput.propTypes = {
  label: propTypes.string.isRequired,
  placeholder: propTypes.string,
  cityStateZip: propTypes.bool,
  dateOfBirth: propTypes.bool,
  availableDates: propTypes.array,
  availableTimes: propTypes.array,
  mergedDates: propTypes.array,
  props: propTypes.object,
  ref: propTypes.object,
  type: propTypes.string,
  className: propTypes.string,
};

export default CustomInput;
