import { Button } from "@/components/ui/button";
import { loginSchema } from "@/schema/auth-schema";
import { Form, Formik } from "formik";
import { ArrowLeft, InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorObject, setErrorObject] = useState<{ email?: string; password?: string; general?: string }>({});

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg shadow-sm rounded-2xl w-full bg-[#fff] h-fit">
                {/* Header */}
                <div onClick={() => {
                    window.history.back();
                }} className="flex items-center cursor-pointer justify-left px-8 h-15 border-b-[1px] border-[#ddd] rounded-t-2xl">
                    <ArrowLeft />
                </div>

                {/* Body */}
                <div className="bg-[#fff] rounded-b-2xl px-10 py-8">

                    <div className="">
                        <p className="font-semibold text-xl">Verify your email address</p>
                        <p className="pt-1 text-sm">We have sent a one time password to the email address you used to register on Firespot Control Panel (areegbedavid@gmail.com)</p>
                    </div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginSchema}
                        onSubmit={async (values) => {
                            // try {
                            //     setErrorObject({});
                            //     setLoading(true);
                            //     const response = await useLogin({ data: values });

                            //     // Example API response handling
                            //     if (response?.data?.message === "There’s no account with this email address. Sign up to continue.") {
                            //         setErrorObject({ email: "There’s no account with this email address. Sign up to continue." });
                            //     } else if (response?.data?.message === "The password entered is incorrect.") {
                            //         setErrorObject({ password: "The password entered is incorrect." });
                            //     } else {
                            //         console.log(response?.data);
                            //     }
                            // } catch (error: any) {
                            //     console.error(error);
                            //     setErrorObject({
                            //         general: error?.response?.data?.message || "Something went wrong. Please try again.",
                            //     });
                            // } finally {
                            //     setLoading(false);
                            // }
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                {/* General API Error */}
                                {errorObject.general && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm pt-3">
                                        <InfoCircle size={16} variant="Bold" />
                                        <p>{errorObject.general}</p>
                                    </div>
                                )}

                                {/* Submit button */}
                                <Link to={"/check-mail"}>
                                    <div className="flex justify-center">
                                        <Button
                                            disabled={isSubmitting || loading}
                                            type="submit"
                                            className="mt-5 py-6 rounded-full bg-[#000000] cursor-pointer px-7 w-full"
                                        >
                                            {loading ? <Loader className="animate-spin" /> : "Continue"}
                                        </Button>
                                    </div>
                                </Link>

                                <p className="font-bold text-[#00000080] pt-3 text-center">
                                    Didn't recieve an OTP? {" "}
                                    <Link to={"/request-access"}>
                                        <span className="bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
                                            Resend OTP
                                        </span>
                                    </Link>
                                </p>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
