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
    "biller_details": {
        "name": "",
        "email": "",
        "address": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "postal_code": "",
            "country": ""
        },
    },
    bookingDate: "",
    bookingTime: "",
    provider: "Any",
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
