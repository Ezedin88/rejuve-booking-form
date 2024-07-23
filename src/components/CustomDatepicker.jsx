/* eslint-disable react/prop-types */
import '../date.css';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enUS } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { useFormikContext } from 'formik';
import { format, parse,addDays } from 'date-fns';

const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n) => {
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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
  const [selectedDate, setSelectedDate] = useState(null);
  const { setFieldValue, values } = useFormikContext();
  const { name, onBlur, dateOfBirth, availableDates, mergedDates } = props || {};
  const datesOnly = mergedDates?.length > 0
    ? mergedDates.map(item => item.date_and_time_clinic.split(' ')[0])
    : [];

  const mergedDates1 = [...new Set(datesOnly), ...new Set(availableDates)];

  const parseDate = (inputDate) => {
    // Assuming inputDate is in the format DDMMYYYY or MM/DD/YYYY or MM-DD-YYYY
    const parts = inputDate.split(/[\\/-]/);
    let month, day, year;

    if (parts.length === 1) {
      // If only numbers provided without separators, assuming MMDDYYYY format
      if (inputDate.length === 8) {
        month = parseInt(inputDate.substring(0, 2), 10);
        day = parseInt(inputDate.substring(2, 4), 10);
        year = parseInt(inputDate.substring(4), 10);
      } else if (inputDate.length === 7) {
        // Assuming MDYYYY format, where the month is one digit and day is two digits
        month = parseInt(inputDate.substring(0, 1), 10);
        day = parseInt(inputDate.substring(1, 3), 10);
        year = parseInt(inputDate.substring(3), 10);
      } else if (inputDate.length === 6) {
        // Assuming DYYYY format, where both month and day are one digit each
        month = parseInt(inputDate.substring(0, 1), 10);
        day = parseInt(inputDate.substring(1, 2), 10);
        year = parseInt(inputDate.substring(2), 10);
      } else {
        // Invalid input format
        return null;
      }
    } else if (parts.length === 3) {
      // If input is in the format MM/DD/YYYY or MM-DD-YYYY
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else {
      // Invalid input format
      return null;
    }

    // Checking for valid date
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return null;
    }

    // Creating a date object
    const date = new Date(year, month - 1, day);

    // Check if date object corresponds to the input date
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    return date;
  };

  const handleDateChange = (date) => {
    const inputDate = date instanceof Date ? date : parseDate(date);
    setSelectedDate(inputDate);
    setFieldValue(name, inputDate ? format(inputDate, 'MM/dd/yyyy') : '');
    // setFieldTouched(name, true, true);
  };

  const handleRawChange = (e) => {
    const rawValue = e.target.value;
    if (/^\d{1,8}$/.test(rawValue)) {
      // Handle raw input of up to 8 digits
      if (rawValue.length === 8) {
        // If the input matches the format DDMMYYYY, parse the date
        const parsedDate = parseDate(rawValue);
        setSelectedDate(parsedDate);
        setFieldValue(name, parsedDate ? format(parsedDate, 'MM/dd/yyyy') : '');
        values.bookingDate = parsedDate ? format(parsedDate, 'MM/dd/yyyy') : '';
        // setFieldTouched(name, true, true);
      } else {
        setSelectedDate(null);
        values.bookingDate = rawValue;
        setFieldValue(name, rawValue);
      }
    } else if (rawValue === '') {
      setSelectedDate(null);
      setFieldValue(name, '');
      // setFieldTouched(name, true, true);
    }
  };

  useEffect(()=>{
    name === 'provider' &&
    setSelectedDate(null);
    setFieldValue(name, '');
  },[values.provider,setFieldValue,name]);

  const getWeekdays = (startDate, numberOfDays) => {
    const dates = [];
    let currentDate = startDate;
    while (dates.length < numberOfDays) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(format(currentDate, 'MM/dd/yyyy'));
      }
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  };

  const anyScheduleDate = getWeekdays(new Date(), 365);

const isProviderAny = values?.provider === 'Any';
const isAvailable1 = mergedDates1.length || mergedDates1[0] === undefined || mergedDates1.length > 0 ?true:false;
const isAvailable2 = !mergedDates1.includes(format(new Date(), 'MM/dd/yyyy'));

  return (
    <div className="date-picker-container">
      <MdOutlineCalendarToday className="calendar-icon" />
      <DatePicker
        className="date-picker custom-tooltip pointer-date-picker"
        data-tooltip='cursor'
        name={name}
        value={selectedDate}
        selected={selectedDate}
        onBlur={onBlur}
        onChange={handleDateChange}
        onChangeRaw={handleRawChange}
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
                { length: new Date().getFullYear() + 1 },
                (_, i) => new Date().getFullYear() - i
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
        placeholderText={`${dateOfBirth && 'MM/DD/YYYY' || isProviderAny ? 'MM/DD/YYYY':
        isAvailable1||isAvailable2 ? 'MM/DD/YYYY' : 'Please Select Another Provider'}`}
        
        dateFormat="MM/dd/yyyy"
        showPopperArrow={false}
        calendarClassName="custom-calendar"
        locale="custom"
        minDate={!dateOfBirth && new Date()}
        maxDate={dateOfBirth &&
          new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())}
        includeDates={
          !dateOfBirth
            ? 
            isProviderAny ? anyScheduleDate.map(date => parse(date, 'MM/dd/yyyy', new Date())) :
            mergedDates1 && mergedDates1.length > 0 && mergedDates1[0] !== undefined
              ? mergedDates1.map(date => parse(date, 'MM/dd/yyyy', new Date()))
              : []
            : undefined
        }
      />
    </div>
  );
};

export default CustomDatepicker;
