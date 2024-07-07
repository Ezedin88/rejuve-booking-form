export const initialValues = {
    userData: [
        {
            billing: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                dateOfBirth: '',
            },
            line_items: [],
        },
    ],
    bookingAddress: {
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
    },
    bookingChoice: 'atourclinics',
    clinicChoice: '',
    biller_details: {
        name: '',
        email: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        },
    },
    card_number: '',
    bookingDate: '',
    bookingTime: '',
    provider: 'Any',
    terms: false,
    paymentMethod: 'creditCard',
    cardNumberElement: {},
};
