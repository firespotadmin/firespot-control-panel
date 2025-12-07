import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/password-input";
import { useLogin } from "@/hooks/auth-hook.hook";
import { loginSchema } from "@/schema/auth-schema";
import { Field, Form, Formik } from "formik";
import { InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [errorObject, setErrorObject] = useState<{ email?: string; password?: string; general?: string }>({});

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg shadow-sm rounded-2xl w-[480px] bg-[#fff] h-fit">
                {/* Header */}
                <div className="bg-[#F4F5F7] flex items-center justify-center h-14 rounded-t-2xl">
                    <p className="font-[700] text-[#00000080] text-center text-[14px]">
                        Don’t have an account?{" "}
                        <Link to={"/request-access"}>
                            <span className="bg-gradient-to-r text-[14px] font-[700] from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
                                Request Access
                            </span>
                        </Link>
                    </p>
                </div>

                {/* Body */}
                <div className="bg-[#fff] rounded-b-2xl p-[32px]">
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="" className="w-[48px] h-[48px]" />
                    </div>

                    <div className="text-center pt-5">
                        <p className="font-[700] text-[20px]">Welcome back</p>
                        <p className="text-[14px] font-[500] text-[#00000080]">Log in to your firespot business account</p>
                    </div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginSchema}
                        onSubmit={async (values) => {
                            try {
                                setErrorObject({});
                                setLoading(true);
                                const response: any = await useLogin({ data: values });

                                // Example API response handling
                                if (response?.data?.message === "There’s no account with this email address. Sign up to continue.") {
                                    setErrorObject({ email: "There’s no account with this email address. Sign up to continue." });
                                } else if (response?.data?.message === "The password entered is incorrect.") {
                                    setErrorObject({ password: "The password entered is incorrect." });
                                } else {
                                    console.log(response?.data);
                                }

                                if (response?.success) {
                                    localStorage.setItem("token", response?.data?.token);
                                    navigate("/dashboard");
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
                                    <Label className="font-[500] text-[#545F6C] text-[12px]" htmlFor="email">
                                        Email address
                                    </Label>
                                    <Field
                                        as={Input}
                                        disabled={loading}
                                        name="email"
                                        id="email"
                                        className="p-[16px] h-[44px] mt-1 text-[14px] font-[500]"
                                        placeholder="Enter your email address"
                                        type="email"
                                    />

                                    {(touched.email && errors.email) || errorObject.email ? (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={14} variant="Bold" />
                                            <p className="text-[12px] font-[500]">{errorObject.email || errors.email}</p>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Password Field */}
                                <div className="pt-5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            className="font-[500] text-[#545F6C] text-[12px]" 
                                            htmlFor="password"
                                        >
                                            Password
                                        </Label>
                                        <Link to={"/initiate-reset"}>
                                            <p className="underline font-[500] text-[12px] text-right cursor-pointer">
                                                Forgot password
                                            </p>
                                        </Link>
                                    </div>

                                    <Field
                                        as={PasswordInput}
                                        disabled={loading}
                                        name="password"
                                        id="password"
                                        className="p-[16px] h-[44px] mt-1 text-[14px] font-[500]"
                                        placeholder="Enter your password"
                                    />

                                    {(touched.password && errors.password) || errorObject.password ? (
                                        <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                            <InfoCircle size={14} variant="Bold" />
                                            <p className="text-[12px] font-[500]">{errorObject.password || errors.password}</p>
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
                                    disabled={isSubmitting || loading}
                                    type="submit"
                                    className="mt-5 p-[12px] text-[16px] font-[700] h-[48px] rounded-full bg-[#000000] cursor-pointer w-full"
                                >
                                    {loading ? <Loader className="animate-spin" /> : "Continue"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
