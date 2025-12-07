import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { InfoCircle, TickCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";

import { usePasswordReset } from "@/hooks/auth-hook.hook";
import toast, { Toaster } from "react-hot-toast";

// ✅ Validation schema for password reset
const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm password is required"),
});

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorObject, setErrorObject] = useState<{ general?: string }>({});
    const [searchParams] = useSearchParams();

    const uid = searchParams.get("uid"); // ✅ Extract ?uid=... from URL


    console.log("UID from query:", uid);

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        if (!uid) {
            setErrorObject({ general: "Invalid or missing reset link." });
            return;
        }

        try {
            setErrorObject({});
            setLoading(true);

            // ✅ API call using hook mutation or function
            const response = await usePasswordReset({ uid, password: values.password });
            ({
                uid,
                password: values.password,
            });

            console.log("Password reset successful:", response);
            // Redirect or display success message
            // e.g. navigate("/login?reset=success")
            if (response?.success) {
                toast.success("Password Reset Successfully!", {
                    icon: "✅",
                    duration: 5000,
                    style: {
                        borderRadius: "100px",
                        background: "#333",
                        color: "#fff",
                        fontSize: "12px",
                    },
                });
                setTimeout(() => {
                    navigate("/");
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
            <Toaster position="top-center" />
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="Firespot Logo" className="h-10" />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <p className="font-semibold text-xl">Change Password</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Enter a new password for your Firespot Control Panel account.
                    </p>
                </div>

                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            {/* New Password */}
                            <div className="pt-3">
                                <Label htmlFor="password" className="text-md text-[#545F6C]">
                                    New Password
                                </Label>
                                <Field
                                    as={PasswordInput}
                                    id="password"
                                    name="password"
                                    placeholder="Enter new password"
                                    disabled={loading}
                                    className="py-5 mt-1"
                                />
                                {touched.password && errors.password && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                        <InfoCircle size={16} variant="Bold" />
                                        <p>{errors.password}</p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="pt-5">
                                <Label htmlFor="confirmPassword" className="text-md text-[#545F6C]">
                                    Confirm Password
                                </Label>
                                <Field
                                    as={PasswordInput}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    disabled={loading}
                                    className="py-5 mt-1"
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                                        <InfoCircle size={16} variant="Bold" />
                                        <p>{errors.confirmPassword}</p>
                                    </div>
                                )}
                            </div>

                            {/* Password strength hint */}
                            <div className="flex gap-1 pt-2">
                                <TickCircle size={20} color="#545F6C" variant="Bold" />
                                <p className="text-[#545F6C] text-sm font-medium">
                                    Use at least 8 characters, including numbers, letters, and symbols.
                                </p>
                            </div>

                            {/* General API Error */}
                            {errorObject.general && (
                                <div className="flex items-center gap-1 text-red-600 text-sm pt-3">
                                    <InfoCircle size={16} variant="Bold" />
                                    <p>{errorObject.general}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="mt-6 py-6 rounded-full cursor-pointer bg-black hover:bg-gray-800 w-full"
                            >
                                {loading ? <Loader className="animate-spin" /> : "Change Password"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ForgotPassword;
