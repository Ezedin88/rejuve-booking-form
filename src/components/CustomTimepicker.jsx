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
  }),
  menu: (provided) => ({
    ...provided,
    width: '150px',
    position: 'absolute',
    left: 0,
  }),
};

const filterPassedTime = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date();
  const [hours, minutes] = time.value.split(':');
  selectedDate.setHours(hours);
  selectedDate.setMinutes(minutes);
  return {
    ...time,
    isDisabled: currentDate.getTime() >= selectedDate.getTime(),
  };
};

const timeOptions = [
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '17:30', label: '5:30 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '18:30', label: '6:30 PM' },
  { value: '19:00', label: '7:00 PM' },
].map(filterPassedTime);

const TimePicker = (props) => {
  const [selectedTime, setSelectedTime] = React.useState(null);
  console.log('selectedtime==>',selectedTime)
  const {setFieldTouched,setFieldValue} = useFormikContext();

  const {name,onBlur} = props;
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
        onBlur={()=>setFieldTouched(name,true,true)}
        name={name}
        value={selectedTime}
        onChange={(selectedOption)=>{
          setSelectedTime(selectedOption);
          console.log('selectedtime==>',selectedOption)
          setFieldValue(name,selectedOption?.label);
        }}
        options={
          filterPassedTime(timeOptions[0]) ? timeOptions : timeOptions.slice(1)
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
