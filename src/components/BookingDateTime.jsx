import CustomInput from '../CustomInput'

function BookingDateTime() {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
    }}>
        <CustomInput label="Booking Date" name="bookingDate" type="date" />
            <CustomInput label="Booking Time" name="bookingTime" type="time" />
    </div>
  )
}

export default BookingDateTime