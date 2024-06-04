export const initialValues = {
    userData: [
        {
            "billing": {
                "first_name": "",
                "last_name": "",
                "email": "",
                "phone": "",
                "dateOfBirth": "",
            },
            "line_items": [],
        },
    ],
    "bookingAddress": {
        "address_1": "",
        "address_2": "",
        "city": "",
        "state": "",
        "postcode": "",
    },
    "bookingChoice": "atourclinics",
    "clinicChoice": "",
    bookingDate: "",
    bookingTime: "",
    provider: "",
    terms: false,
    paymentMethod: 'creditCard',
    cardNumberElement: {},
}


// {
//     product_id: '',
//     quantity: 0,
//     meta_data: [
//       {
//         key: 'type',
//         value: 'house'
//       },
//       {
//         key: 'Name',
//         value: ''
//       },
//       {
//         key: 'Email',
//         value: ''
//       },
//       {
//         key: 'Booking',
//         value: 'house'
//       },
//       {
//         key: 'Provider',
//         value: 'any'
//       }
//     ]
//   }
