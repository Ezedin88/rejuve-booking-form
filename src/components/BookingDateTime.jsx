import CustomInput from '../CustomInput'

function BookingDateTime() {
  return (
    <div>
        <CustomInput label="Booking Date" name="bookingDate" type="date" />
            <CustomInput label="Booking Time" name="bookingTime" type="time" />
          
    </div>
  )
}

export default BookingDateTime