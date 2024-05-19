import * as yup from "yup";

export const billingSchema = yup.object().shape({
    first_name: yup.string()
        .min(3, 'First name must be at least 3 characters')
        .max(50, 'First name must be at most 50 characters')
        .required('First name is required'),
    last_name: yup.string()
        .min(3, 'Last name must be at least 3 characters')
        .max(50, 'Last name must be at most 50 characters')
        .required('Last name is required'),
    email: yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, 'Invalid email address'),
    phone: yup.string().required('Phone number is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    address_1: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postcode: yup.string().required('Postcode is required'),
});

export const handleValidation = yup.object().shape({
    userData: yup.array().of(
        yup.object().shape({
            billing: billingSchema,
            Booking: yup.string().required('Booking is required'),
            clinic:yup.string().required('Clinic is required'),
        })
    )
});
