/* eslint-disable react/prop-types */
import React from 'react';
import Select from 'react-select';
import { FaRegClock } from 'react-icons/fa';
import { components } from 'react-select';
import { FaChevronDown } from 'react-icons/fa';
import { useFormikContext } from 'formik';

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    padding: 10,
    backgroundColor: state.isDisabled
      ? '#fff'
      : state.isFocused
      ? '#eafdff'
      : '#fff',
    color: state.data.isDisabled ? '#aaa' : '#333',
  }),
  control: () => ({
    display: 'flex',
    width: 300,
    position: 'relative',
    paddingLeft: 25,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333',
    margin: 'unset !important',
  }),
  menu: (provided) => ({
    ...provided,
    width: '150px',
    position: 'absolute',
    left: 0,
  }),
};

const timeOptions = [];
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j += 30) {
    const hour = i % 12 || 12;
    const period = i < 12 || i === 24 ? 'AM' : 'PM';
    const label = `${hour}:${j.toString().padStart(2, '0')} ${period}`;
    const value = label;
    timeOptions.push({ value, label });
  }
}

function formatTimes(times) {
  return times?.map(time => ({
      label: time,
      value: time
  }));
}

const TimePicker = (props) => {
  const [selectedTime, setSelectedTime] = React.useState(null);
  const { setFieldTouched, setFieldValue, values } = useFormikContext();
  const { name } = props;
  const availableTimes = props?.availableTimes;
  const formatedAvailableTimeOptions = formatTimes(availableTimes);
  const Option = (props) => {
    return (
      <components.Option {...props}>
        <input
          className={`time-picker-checkbox custom-checkbox ${
            props.data.isDisabled ? 'disabled' : ''
          }`}
          type="checkbox"
          checked={props.isSelected}
          readOnly
        />
        {props.label}
      </components.Option>
    );
  };

  const formatOptionLabel = ({ label }) => (
    <div style={{ marginRight: 'auto' }}>{label}</div>
  );

  const DropdownIndicator = (props) => {
    return (
      <div style={{ width: '100%' }}>
        <components.DropdownIndicator {...props}>
          <FaChevronDown
            style={{ position: 'absolute', right: 0, top: '30%' }}
          />
        </components.DropdownIndicator>
      </div>
    );
  };

  return (
    <div className="time-picker">
      <FaRegClock className="clock-icon" />
      <Select
        blurInputOnSelect={true}
        onBlur={() => setFieldTouched(name, true)} // Ensure field is touched on blur
        isOptionSelected={(value) => !value && setFieldTouched(name, true)} // Correct usage of isOptionSelected
        name={name}
        value={selectedTime}
        onChange={(selectedOption) => {
          setFieldTouched(name, true); // Mark field as touched on selection
          setSelectedTime(selectedOption);
          setFieldValue(name, selectedOption.value);
          values.bookingTime = selectedOption.value;
        }}
        options={formatedAvailableTimeOptions?.length>0&&formatedAvailableTimeOptions||timeOptions}
        className="time-picker-select"
        placeholder="HH:MM AM/PM"
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        components={{ DropdownIndicator, Option }}
        isOptionDisabled={(option) => option.isDisabled}
      />
    </div>
  );
};

export default TimePicker;
