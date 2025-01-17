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
    cursor: state.isDisabled ? 'not-allowed' : 'pointer', // Update cursor style
  }),
  control: () => ({
    display: 'flex',
    width: 300,
    position: 'relative',
    paddingLeft: 25,
    cursor: 'pointer',
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
  return times?.length>0 && times?.map(time => ({
      label: time,
      value: time
  }))||[];
}

const TimePicker = (props) => {
  const [selectedTime, setSelectedTime] = React.useState(null);
  const { setFieldTouched, setFieldValue, values } = useFormikContext();


  const currentTime = new Date();
let futureTime = new Date();

// Calculate future time (3 hours from now) if values.provider === 'Any' and values.bookingDate is today
if (values.provider === 'Any' && values.bookingDate && new Date(values.bookingDate).toDateString() === currentTime.toDateString()) {
  futureTime.setHours(currentTime.getHours() + 3);
}

const filteredTimeOptions = timeOptions.filter(({ value }) => {
  const [time, period] = value.split(' ');
  const [hour, minute] = time.split(':').map(Number);

  let timeIn24HourFormat;
  if (period === 'AM') {
    timeIn24HourFormat = hour % 12;
  } else {
    timeIn24HourFormat = (hour % 12) + 12;
  }

  const optionDate = new Date();
  optionDate.setHours(timeIn24HourFormat);
  optionDate.setMinutes(minute);

  // Check if the time is within 10:30 AM to 6:30 PM range
  const isInTimeRange = 
    (timeIn24HourFormat > 10 || (timeIn24HourFormat === 10 && minute >= 30)) &&
    (timeIn24HourFormat < 18 || (timeIn24HourFormat === 18 && minute <= 30));

  // Check if the time is at least 3 hours later than the current time
  const isLaterThanFutureTime = !(
    values.provider === 'Any' &&
    values.bookingDate &&
    new Date(values.bookingDate).toDateString() === currentTime.toDateString() &&
    optionDate < futureTime
  );

  return isInTimeRange && isLaterThanFutureTime;
});




  const { name } = props;
  const availableTimes = props?.availableTimes;
  const mergedDates = props?.mergedDates;
 
  const timesForSelectedDate = values?.bookingDate && mergedDates?.length > 0 && [...new Set(
    mergedDates
        .filter(item => item.date_and_time_clinic.startsWith(values?.bookingDate))
        .map(item => item.date_and_time_clinic.split(' ')[1] + ' ' + item.date_and_time_clinic.split(' ')[2])
)];

  const formatSelectedDate = timesForSelectedDate?.length>0 ? formatTimes(timesForSelectedDate) : [];
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
        {/* <components.DropdownIndicator {...props}>
          <FaChevronDown
            style={{ position: 'absolute', right: 0, top: '30%' }}
          />
        </components.DropdownIndicator> */}
      </div>
    );
  };

  return (
    <div className="time-picker">
      <FaRegClock className="clock-icon" />
      <Select
  isDisabled={values.bookingDate ? false : true}
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
  options={
    values.provider === 'Any'
      ? filteredTimeOptions
      : formatSelectedDate?.length > 0
      ? formatSelectedDate
      : formatedAvailableTimeOptions?.length > 0
      ? formatedAvailableTimeOptions
      : []
  }
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
