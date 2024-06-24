import { useEffect, useState } from 'react';
import CustomInput from '../CustomInput'
import { client } from '../api/client';

function BookingDateTime({ values, availableBookingPeriods }) {
  function getAvailableSlots(bookingPeriods) {
    const takenDates = new Set(bookingPeriods?.takenDates ?? []);
    const takenTimes = new Set(bookingPeriods?.takenTimes ?? []);
    const takenDateTime = new Set(bookingPeriods?.takenTimeDate ?? []);

    const availableDatesRaw = values.bookingChoice === 'atourclinics' 
        ? bookingPeriods?.select_available_dates_at_clinic ?? []
        : bookingPeriods?.select_available_dates_house_call ?? [];
    const availableTimesRaw = values.bookingChoice === 'atourclinics'
        ? bookingPeriods?.select_available_time__at_clinic__ ?? []
        : bookingPeriods?.select_available_time__house_call_ ?? [];

    const availableMergedDateTime = values.bookingChoice === 'atourclinics'
    ? bookingPeriods?.resultSpecificAvailableDateAndTimeClinic?? []
    : bookingPeriods?.specificAvailableDateAndTimeHouse ?? [];

    // If takenDates is empty, return all available dates
    const availableDates = takenDates.size === 0
        ? availableDatesRaw
        : availableDatesRaw.filter(date => !takenDates.has(date));

    // If takenTimes is empty, return all available times
    const availableTimes = takenTimes.size === 0
        ? availableTimesRaw
        : availableTimesRaw.filter(time => !takenTimes.has(time));

    return { availableDates, availableTimes, availableMergedDateTime,takenDateTime };
}

const availableSlots = getAvailableSlots(availableBookingPeriods);
  return (
    <div 
    className='bookingDateTime-container-wrapper'
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent:'space-between'
    }}>
      <CustomInput availableDates={availableSlots?.availableDates} mergedDates={availableSlots?.availableMergedDateTime} label="Date" name="bookingDate" type="date" 
      />
      <CustomInput availableTimes={availableSlots?.availableTimes} mergedDates={availableSlots?.availableMergedDateTime} label="Time" name="bookingTime" type="time" />
    </div>
  )
}

export default BookingDateTime