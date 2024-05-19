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
    booking: yup.string().required('Booking is required'),
    address_1: yup.string().when("booking",{
        is:(val)=>{
            return val === 'housecall'
        },
        then:(s)=>s.required('Address is required'),
        otherwise: yup.string().notRequired()
    }),
    city: yup.string().when("booking",{
        is:(val)=>{
            return val === 'housecall'
        },
        then:(s)=>s.required('Address is required'),
        otherwise: yup.string().notRequired()
    }),
    state: yup.string().when("booking",{
        is:(val)=>{
            return val === 'housecall'
        },
        then:(s)=>s.required('state is required'),
        otherwise: yup.string().notRequired()
    }),
    postcode: yup.string().when("booking",{
        is:(val)=>{
            return val === 'housecall'
        },
        then:(s)=>s.required('postcode is required'),
        otherwise: yup.string().notRequired()
    }),
    clinic: yup.string().when("booking",{
        is:(val)=>{
            return val === 'atourclinics'
        },
        then:(s)=>s.required('clinic is required'),
        otherwise: yup.string().notRequired()
    }),
});

export const handleValidation = yup.object().shape({
    userData: yup.array().of(
        yup.object().shape({
            Booking: yup.string().required('Booking1 is required'),
            billing: billingSchema,
        })
    ),
    bookingDate: yup.string().required('Booking date is required'),
    bookingTime: yup.string().required('Booking time is required'),
    terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});
