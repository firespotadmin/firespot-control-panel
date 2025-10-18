import * as Yup from 'yup';
export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('We need your email address to get you started'),
    password: Yup.string()
        .min(4, 'Password must be at least 4 characters')
        .required('Please enter your password to continue'),
});

export const requestAccessSchema = Yup.object().shape({
  emailAddress: Yup.string()
    .email("Enter a valid email address")
    .required("Email address is required"),
  role: Yup.string().required("Role is required"),
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phone: Yup.string()
    .matches(/^\+?\d{8,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
});