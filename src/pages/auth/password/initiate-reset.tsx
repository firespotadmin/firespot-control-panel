import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useInitiateReset } from "@/hooks/auth-hook.hook";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema (for forgot password)
const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email address")
        .required("Email address is required"),
});

const InitiateReset = () => {
    const [loading, setLoading] = useState(false);
    const [errorObject, setErrorObject] = useState<{ email?: string; general?: string }>({});
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string }) => {
        try {
            setErrorObject({});
            setLoading(true);

            // Example API call — replace with your real forgot password hook or service
            const response = await useInitiateReset({ email: values.email });
            setErrorObject({ email: response?.data?.message });
            if (response.success) {
                setTimeout(() => {
                    navigate("/check-mail");
                }, 1500);
            }
        } catch (error: any) {
            console.error(error);
            setErrorObject({
                general: error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm">
                {/* Header */}
                <div
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 cursor-pointer px-8 h-14 border-b border-gray-200 rounded-t-2xl"
                >
                    <ArrowLeft />
                </div>

                {/* Body */}
                <div className="px-10 py-8">
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="Firespot Logo" className="h-10" />
                    </div>

                    <div className="text-center pt-5">
                        <p className="font-semibold text-xl">Forgot Password</p>
                        <p className="text-gray-600 text-sm mt-2">
                            Please enter the email address you used to sign up on the Firespot Control Panel.
                        </p>
                    </div>

                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={forgotPasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                {/* Email Field */}
                                <div className="pt-6">
                                    <Label className="text-md text-[#545F6C]" htmlFor="email">
                                        Email address
                                    </Label>
                                    <Field
                                        as={Input}
                                        name="email"
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="py-5 mt-1"
                                        disabled={loading}
                                    />

                                    {(touched.email && errors.email) || errorObject.email ? (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={16} variant="Bold" />
                                            <p>{errorObject.email || errors.email}</p>
                                        </div>
                                    ) : null}
                                </div>

                                {/* General Error */}
                                {errorObject.general && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm pt-3">
                                        <InfoCircle size={16} variant="Bold" />
                                        <p>{errorObject.general}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end mt-6">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="py-6 rounded-full bg-black hover:bg-gray-800 px-7"
                                    >
                                        {loading ? <Loader className="animate-spin" /> : "Continue"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default InitiateReset;
