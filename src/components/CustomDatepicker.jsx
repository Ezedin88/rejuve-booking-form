/* eslint-disable react/prop-types */
import '../date.css';
import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enUS } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { useFormikContext } from 'formik';
import { format } from 'date-fns';

const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n) => {
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'SAT', 'SUN'];
      return dayNames[n];
    },
  },
  options: {
    ...enUS.options,
    weekStartsOn: 1,
  },
};

registerLocale('custom', customLocale);

const CustomDatepicker = (props) => {
  const [selectedDate, setSelectedDate] = useState('');
  const {setFieldTouched,setFieldValue} = useFormikContext();
  const {name,onBlur} = props;
  
  return (
    <div className="date-picker-container">
      <MdOutlineCalendarToday className="calendar-icon" />
      <DatePicker
        className="date-picker"
        name={name}
        value={selectedDate}
        selected={selectedDate}
        onBlur={onBlur}
        onChange={(date) => {setSelectedDate(date);
          setFieldValue(name,format(date, 'dd/MM/yyyy'))
        }}
        onChangeRaw={()=>setFieldTouched(name,true,true)}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="custom-header">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              <FaChevronLeft />
            </button>
            <select
  value={date.getFullYear()}
  onChange={({ target: { value } }) => changeYear(value)}
>
  {Array.from(
    { length: new Date().getFullYear() + 1 }, // Calculate the number of years since 1970
    (_, i) => new Date().getFullYear() - i // Generate years dynamically
  ).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

            <select
              value={date.getMonth()}
              onChange={({ target: { value } }) => changeMonth(value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <FaChevronRight />
            </button>
          </div>
        )}
        placeholderText="MM/DD/YYYY"
        dateFormat="MM/dd/yyyy"
        showPopperArrow={false}
        calendarClassName="custom-calendar"
        locale="custom"
      />
    </div>
  );
};

export default CustomDatepicker;
