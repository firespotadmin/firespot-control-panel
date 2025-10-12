import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth-hook.hook";
import { loginSchema } from "@/schema/auth-schema";
import { Field, Form, Formik } from "formik";
import { InfoCircle, TickCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorObject, setErrorObject] = useState<{ email?: string; password?: string; general?: string }>({});

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg shadow-sm rounded-2xl w-full bg-[#fff] h-fit">

                {/* Body */}
                <div className="bg-[#fff] rounded-2xl px-10 py-8">
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="" />
                    </div>

                    <div className="text-center pt-5">
                        <p className="font-semibold text-xl">Change Password</p>
                        <p>Enter a new password for your Firespot Control Panel account</p>
                    </div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginSchema}
                        onSubmit={async (values) => {
                            try {
                                setErrorObject({});
                                setLoading(true);
                                const response = await useLogin({ data: values });

                                // Example API response handling
                                if (response?.data?.message === "There’s no account with this email address. Sign up to continue.") {
                                    setErrorObject({ email: "There’s no account with this email address. Sign up to continue." });
                                } else if (response?.data?.message === "The password entered is incorrect.") {
                                    setErrorObject({ password: "The password entered is incorrect." });
                                } else {
                                    console.log(response?.data);
                                }
                            } catch (error: any) {
                                console.error(error);
                                setErrorObject({
                                    general: error?.response?.data?.message || "Something went wrong. Please try again.",
                                });
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                {/* Email Field */}
                                <div className="pt-5">
                                    <Label className="text-md text-[#545F6C]" htmlFor="email">
                                        Password
                                    </Label>
                                    <Field
                                        as={Input}
                                        disabled={loading}
                                        name="password"
                                        id="password"
                                        className="py-5 mt-1"
                                        placeholder="Enter your password"
                                        type="password"
                                    />

                                    {(touched.email && errors.email) || errorObject.email ? (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={16} variant="Bold" />
                                            <p>{errorObject.email || errors.email}</p>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Password Field */}
                                <div className="pt-5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            className="text-md text-[#545F6C]"
                                            htmlFor="password"
                                        >
                                            Password
                                        </Label>
                                    </div>

                                    <Field
                                        as={Input}
                                        disabled={loading}
                                        name="password"
                                        id="password"
                                        className="py-5 mt-1"
                                        placeholder="Enter your password"
                                        type="password"
                                    />

                                    {(touched.password && errors.password) || errorObject.password ? (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={16} variant="Bold" />
                                            <p>{errorObject.password || errors.password}</p>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex gap-1 pt-2">
                                    <TickCircle size={20} color="#545F6C" variant="Bold" />
                                    <p className="text-[#545F6C] text-sm font-medium">Use a combination of at least 8 numbers, letters and punctuation marks</p>
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
                                    disabled={isSubmitting || loading}
                                    type="submit"
                                    className="mt-5 py-6 rounded-full bg-[#000000] cursor-pointer w-full"
                                >
                                    {loading ? <Loader className="animate-spin" /> : "Change Password"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
