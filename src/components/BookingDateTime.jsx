import { useEffect, useState } from 'react';
import CustomInput from '../CustomInput'
import { client } from '../api/client';

function BookingDateTime({ values, availableBookingPeriods }) {
  function getAvailableSlots(bookingPeriods) {
    const takenDates = new Set(bookingPeriods?.takenDates ?? []);
    const takenTimes = new Set(bookingPeriods?.takenTimes ?? []);

    const availableDatesRaw = values.bookingChoice === 'atourclinics'? bookingPeriods?.select_available_dates_at_clinic ?? []: bookingPeriods?.select_available_dates_house_call ?? [];

    const availableTimesRaw =  values.bookingChoice === 'atourclinics'?   bookingPeriods?.select_available_time__at_clinic__ ?? []:
    bookingPeriods?.select_available_time__house_call_ ?? []
    ;

    const availableDates = Array.isArray(availableDatesRaw)
        ? availableDatesRaw.map(dateObj => dateObj.select_date).filter(date => !takenDates.has(date))
        : [];

    const availableTimes = Array.isArray(availableTimesRaw)
        ? availableTimesRaw.filter(time => !takenTimes.has(time))
        : [];

    return { availableDates, availableTimes };
}

  const availableSlots = getAvailableSlots(availableBookingPeriods);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
    }}>
      <CustomInput availableDates={availableSlots?.availableDates} label="Booking Date" name="bookingDate" type="date" 
      />
      <CustomInput availableTimes={availableSlots?.availableTimes} label="Booking Time" name="bookingTime" type="time" />
    </div>
  )
}

export default BookingDateTime