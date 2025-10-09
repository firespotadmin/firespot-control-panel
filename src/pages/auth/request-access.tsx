import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Formik, Form, Field } from "formik";
import { useLogin } from "@/hooks/auth-hook.hook";
import { requestAccessSchema } from "@/schema/auth-schema";

const RequestAccess = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorObject, setErrorObject] = useState<{ general?: string }>({});
    const [phone, setPhone] = useState<string>("");

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg shadow-sm rounded-2xl w-full bg-[#fff] h-fit">
                {/* Header */}
                <div className="bg-[#F4F5F7] flex items-center justify-center h-14 rounded-t-2xl">
                    <p className="font-bold text-[#00000080] text-center">
                        Already have an account?{" "}
                        <Link to={"/"}>
                            <span className="bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
                                Log in
                            </span>
                        </Link>
                    </p>
                </div>

                {/* Body */}
                <div className="bg-[#fff] rounded-b-2xl px-10 py-8">
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>

                    <div className="text-center pt-5">
                        <p className="font-semibold text-xl">Request access</p>
                        <p className="text-sm text-[#666]">
                            The Super Admin will approve or deny your request
                        </p>
                    </div>

                    <Formik
                        initialValues={{
                            email: "",
                            role: "",
                            firstName: "",
                            lastName: "",
                            phone: "",
                        }}
                        validationSchema={requestAccessSchema}
                        onSubmit={async (values) => {
                            try {
                                setErrorObject({});
                                setLoading(true);
                                // const response = await useLogin({ data: { ...values, phone } });

                                // console.log(response?.data);
                            } catch (error: any) {
                                console.error(error);
                                setErrorObject({
                                    general:
                                        error?.response?.data?.message ||
                                        "Something went wrong. Please try again.",
                                });
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {({ errors, touched, values, setFieldValue }) => (
                            <Form>
                                {/* Email Field */}
                                <div className="pt-5">
                                    <Label className="text-sm text-[#545F6C]" htmlFor="email">
                                        Email address
                                    </Label>
                                    <Field
                                        as={Input}
                                        disabled={loading}
                                        name="email"
                                        id="email"
                                        className="py-5 mt-1"
                                        placeholder="Enter your email address"
                                        type="email"
                                    />
                                    {touched.email && errors.email && (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={16} variant="Bold" />
                                            <p>{errors.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Role Field */}
                                <div className="pt-5">
                                    <Label className="text-sm text-[#545F6C]" htmlFor="role">
                                        Role
                                    </Label>

                                    <Select
                                        onValueChange={(value) => setFieldValue("role", value)}
                                        defaultValue={values.role}
                                    >
                                        <SelectTrigger className="w-full py-5 mt-1">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                                            <SelectItem value="CUSTOMER_CARE">
                                                CUSTOMER_CARE
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {touched.role && errors.role && (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={16} variant="Bold" />
                                            <p>{errors.role}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="pt-5">
                                    <Label className="text-sm text-[#545F6C]">
                                        Contact Information
                                    </Label>

                                    <div className="contact-input-group mt-1">
                                        {/* First + Last Name */}
                                        <div className="flex border border-[#ddd] rounded-t-lg overflow-hidden">
                                            <Field
                                                as={Input}
                                                disabled={loading}
                                                name="firstName"
                                                id="firstName"
                                                className="py-5 flex-1 border-none shadow-none focus-visible:ring-0"
                                                placeholder="First name"
                                                type="text"
                                            />
                                            <div className="w-[1px] bg-[#ddd]" />
                                            <Field
                                                as={Input}
                                                disabled={loading}
                                                name="lastName"
                                                id="lastName"
                                                className="py-5 flex-1 border-none shadow-none focus-visible:ring-0"
                                                placeholder="Last name"
                                                type="text"
                                            />
                                        </div>

                                        {/* Phone Input */}
                                        <div className="">
                                            <PhoneInput
                                                defaultCountry="ng"
                                                value={phone}
                                                onChange={(val) => {
                                                    setPhone(val);
                                                    setFieldValue("phone", val);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    alignItems: "center",
                                                    borderTopRightRadius : 0,
                                                    borderBottomLeftRadius: 10,
                                                    borderBottomRightRadius: 10,
                                                }}
                                                forceDialCode={true}
                                                countrySelectorStyleProps={{
                                                    buttonStyle: {
                                                        padding: 20,
                                                        borderTop: "none",
                                                        borderTopRightRadius : 0,
                                                        borderBottomLeftRadius: 15
                                                    }
                                                }}
                                                inputClassName="w-full py-6"
                                                inputStyle={{
                                                    padding: "20px 10px",
                                                    borderTopRightRadius : 0,
                                                    borderBottomRightRadius: 15,
                                                    borderTop: "none",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Validation errors */}
                                    {(touched.firstName && errors.firstName) ||
                                        (touched.lastName && errors.lastName) ||
                                        (touched.phone && errors.phone) ? (
                                        <div className="flex flex-col gap-1 text-red-600 text-sm pt-1">
                                            {errors.firstName && (
                                                <div className="flex items-center gap-1">
                                                    <InfoCircle size={16} variant="Bold" />
                                                    <p>{errors.firstName}</p>
                                                </div>
                                            )}
                                            {errors.lastName && (
                                                <div className="flex items-center gap-1">
                                                    <InfoCircle size={16} variant="Bold" />
                                                    <p>{errors.lastName}</p>
                                                </div>
                                            )}
                                            {errors.phone && (
                                                <div className="flex items-center gap-1">
                                                    <InfoCircle size={16} variant="Bold" />
                                                    <p>{errors.phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>

                                {/* General API Error */}
                                {errorObject.general && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm pt-3">
                                        <InfoCircle size={16} variant="Bold" />
                                        <p>{errorObject.general}</p>
                                    </div>
                                )}

                                {/* Submit button */}
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="mt-6 py-6 rounded-full bg-[#000000] cursor-pointer w-full"
                                >
                                    {loading ? <Loader className="animate-spin" /> : "Send Request"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;

